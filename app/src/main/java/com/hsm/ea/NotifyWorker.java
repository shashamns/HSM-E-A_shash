package com.hsm.ea;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.HashSet;
import java.util.TimeZone;
import androidx.work.WorkManager;
import java.util.concurrent.TimeUnit;
import java.util.Set;

/**
 * Runs about every 15-30 minutes in the background (even when the app is closed).
 * Asks the server (hsm_notify_poll) what is waiting for this person and shows a
 * phone notification for every item it has not shown before.
 */
public class NotifyWorker extends Worker {

    static final String PREFS = "hsm_notify";
    static final String CHANNEL = "hsm_alerts";            // new id (v3.14): channels keep the first settings Android saw, so the old silent one is replaced
    static final String OLD_CHANNEL = "hsm_updates";
    private static final String BASE = "https://jqxabsioebndhslyagxc.supabase.co";
    private static final String API_KEY = "sb_publishable_iemA7-rKgs1VdZSH9hd2Kw__8458frU";

    public NotifyWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    /** One extra check every day at 8 PM IST so "Tomorrow is your A shift" arrives at 8 o'clock, not at the next 15-minute slot. */
    static void scheduleDuty(Context ctx) {
        Calendar c = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        long now = c.getTimeInMillis();
        c.set(Calendar.HOUR_OF_DAY, 20); c.set(Calendar.MINUTE, 0); c.set(Calendar.SECOND, 5); c.set(Calendar.MILLISECOND, 0);
        if (c.getTimeInMillis() <= now) c.add(Calendar.DAY_OF_YEAR, 1);
        long delay = Math.max(c.getTimeInMillis() - now, 1000);
        androidx.work.Constraints cons = new androidx.work.Constraints.Builder().setRequiredNetworkType(androidx.work.NetworkType.CONNECTED).build();
        androidx.work.PeriodicWorkRequest req = new androidx.work.PeriodicWorkRequest.Builder(NotifyWorker.class, 24, TimeUnit.HOURS)
                .setInitialDelay(delay, TimeUnit.MILLISECONDS).setConstraints(cons).build();
        WorkManager.getInstance(ctx).enqueueUniquePeriodicWork("hsm_duty", androidx.work.ExistingPeriodicWorkPolicy.KEEP, req);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context ctx = getApplicationContext();
        SharedPreferences sp = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String key = sp.getString("key", null);
        if (key == null || key.length() < 32) return Result.success();
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) new URL(BASE + "/rest/v1/rpc/hsm_notify_poll").openConnection();
            c.setRequestMethod("POST");
            c.setConnectTimeout(15000);
            c.setReadTimeout(20000);
            c.setDoOutput(true);
            c.setRequestProperty("apikey", API_KEY);
            c.setRequestProperty("Content-Type", "application/json");
            byte[] body = ("{\"p_key\":\"" + key + "\"}").getBytes("UTF-8");
            try (OutputStream os = c.getOutputStream()) { os.write(body); }
            if (c.getResponseCode() != 200) return Result.retry();
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            try (InputStream is = c.getInputStream()) {
                byte[] buf = new byte[4096]; int n;
                while ((n = is.read(buf)) > 0) bo.write(buf, 0, n);
            }
            JSONArray items = new JSONArray(bo.toString("UTF-8"));
            Set<String> shown = new HashSet<>(sp.getStringSet("shown", new HashSet<String>()));
            Set<String> current = new HashSet<>();
            JSONArray fresh = new JSONArray();
            for (int i = 0; i < items.length(); i++) {
                JSONObject o = items.getJSONObject(i);
                String k = o.optString("k");
                current.add(k);
                if (!shown.contains(k)) fresh.put(o);
            }
            if (fresh.length() > 0) show(ctx, fresh);
            // remember only what is still waiting, so the list never grows forever
            sp.edit().putStringSet("shown", current).apply();
            return Result.success();
        } catch (Exception e) {
            return Result.retry();
        } finally {
            if (c != null) c.disconnect();
        }
    }

    private void show(Context ctx, JSONArray fresh) throws Exception {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try { nm.deleteNotificationChannel(OLD_CHANNEL); } catch (Exception ignored) { }
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Duty alerts & approvals", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Tomorrow's duty, approvals, leave requests and suggestions");
            ch.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            ch.enableVibration(true);
            ch.setVibrationPattern(new long[]{0, 250, 150, 250});
            ch.enableLights(true);
            ch.setLightColor(0xFFC8102E);
            ch.setShowBadge(true);
            ch.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI,
                    new android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
                            .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
            nm.createNotificationChannel(ch);
        }
        Intent open = new Intent(ctx, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        int total = fresh.length();
        int single = Math.min(total, 3);
        for (int i = 0; i < single; i++) {
            JSONObject o = fresh.getJSONObject(i);
            nm.notify(2000 + (o.optString("k").hashCode() & 0xFFFFF), build(ctx, pi, o.optString("t"), o.optString("b")));
        }
        if (total > single) {
            nm.notify(1100, build(ctx, pi, "HSM E&A", (total - single) + " more update" + (total - single > 1 ? "s" : "") + " waiting – open the app"));
        }
    }

    private android.app.Notification build(Context ctx, PendingIntent pi, String title, String text) {
        return new NotificationCompat.Builder(ctx, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat)
                .setContentTitle(title)
                .setContentText(text)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(text))
                .setColor(0xFFC8102E)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setContentIntent(pi)
                .build();
    }
}

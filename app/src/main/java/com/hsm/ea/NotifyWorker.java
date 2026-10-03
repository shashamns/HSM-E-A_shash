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
import java.util.HashSet;
import java.util.Set;

/**
 * Runs about every 15-30 minutes in the background (even when the app is closed).
 * Asks the server (hsm_notify_poll) what is waiting for this person and shows a
 * phone notification for every item it has not shown before.
 */
public class NotifyWorker extends Worker {

    static final String PREFS = "hsm_notify";
    static final String CHANNEL = "hsm_updates";
    private static final String BASE = "https://jqxabsioebndhslyagxc.supabase.co";
    private static final String API_KEY = "sb_publishable_iemA7-rKgs1VdZSH9hd2Kw__8458frU";

    public NotifyWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
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
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Approvals & updates", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Approvals, leave requests and suggestions");
            nm.createNotificationChannel(ch);
        }
        Intent open = new Intent(ctx, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        int total = fresh.length();
        int single = Math.min(total, 3);
        for (int i = 0; i < single; i++) {
            JSONObject o = fresh.getJSONObject(i);
            nm.notify(1000 + i, build(ctx, pi, o.optString("t"), o.optString("b")));
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
                .setContentIntent(pi)
                .build();
    }
}

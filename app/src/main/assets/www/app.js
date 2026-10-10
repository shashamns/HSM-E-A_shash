/* HSM E&A App – Electrical & Automation, Hot Strip Mill */
'use strict';

/* ================= CONFIG ================= */
const SB_URL = 'https://jqxabsioebndhslyagxc.supabase.co';
const SB_KEY = 'sb_publishable_iemA7-rKgs1VdZSH9hd2Kw__8458frU';
const ADMIN_MAIL = 'shash2811@gmail.com';
const ADMIN_NAME = 'Shashank Agrawal';
const SOP_BUCKET = 'sop-docs';
const MILL_PROCESS_BUCKET = 'mill-process-sops';

const APP_VERSION = '3.12';
const SPARE_AREAS = ['Automation (L1)','Instrument','RM','FM','DC','ABB MV Drive','ABB LV Drive','Motor','Power','Crane','Shift','RG','Planning'];
const DOC_AREAS = ['CB','DC','FM','LEVEL1','RHF','RM'];
const MODULES = [['schedule','Shift Schedule','cal','Monthly roster'],['checklist','Check List','check','Daily inspection'],['spares','Spares','box','Stock & location'],
  ['sop','SOP & HIRAC','shield','Numbers, hazards, docs'],['mill',"SOP's of Mill Process",'doc','Operational procedures'],['team','Team','users','E&amp;A directory'],
  ['contacts','Contacts','phone','AMNS phone numbers'],['tbt','TBT – HSM Electrical','talk','Tool box talks'],['leave','Leave Request','plane','Apply & approve'],
  ['drive','Drive','drive','Drive manuals & fault codes (PDF)']];
const ALL_MODS = MODULES.map(m => m[0]);
const ROUTE_MOD = { schedule: 'schedule', checklist: 'checklist', actions: 'checklist', cl: 'checklist', clh: 'checklist', cle: 'checklist', spares: 'spares', spare: 'spares', sop: 'sop', hirac: 'sop', mill: 'mill', team: 'team',
  contacts: 'contacts', tbt: 'tbt', leave: 'leave', drive: 'drive', clset: 'clset' };
const MILL_AREAS = [['CB','CB'],['DC','DC'],['FM','FM'],['LEVEL-1','Level 1'],['RHF','RHF'],['RM','RM'],['CRANE','Crane'],['MOTOR','Motor'],['POWER','Power'],['INSTRUMENT','Instrument']];
const CL_AREAS = [['ABB','ABB Drive'],['DC','DC'],['FMCB','FM & CB'],['INST','Instrument'],['MOTOR','Motor'],['POWER','Power'],['RHF','RHF'],['RM','RM']];
const AREA_MODS = { checklist: CL_AREAS, clset: CL_AREAS, mill: MILL_AREAS, get drive() { return DRIVE_TABS; } };
const SHIFT_NAME = { A: 'A Shift', B: 'B Shift', C: 'C Shift', G: 'General', L: 'Leave', WO: 'Weekly Off' };
const SOP_GROUPS = ['All','Common','Instrument','RM','CB','FM','Coiler','MD Motor','Crane','Power'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY3 = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAYNAME = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SHIFT_TIME = { A: '7:00 AM – 3:00 PM', B: '3:00 PM – 11:00 PM', C: '11:00 PM – 7:00 AM', G: 'General' };
// National holidays + main festivals (gazetted ones are marked 'n'/'f'; lunar dates can move by a day – the admin can add or fix dates in the app)
const HOLIDAYS = [
['2026-01-14','Makar Sankranti / Uttarayan','r'],['2026-01-15','Pongal','r'],['2026-01-23','Vasant Panchami','r'],['2026-01-26','Republic Day','n'],['2026-02-15','Maha Shivaratri','r'],
['2026-03-03','Holika Dahan','r'],['2026-03-04','Holi','f'],['2026-03-19','Gudi Padwa / Ugadi','r'],['2026-03-21','Id-ul-Fitr (Eid)','f'],['2026-03-26','Ram Navami','f'],['2026-03-31','Mahavir Jayanti','f'],
['2026-04-03','Good Friday','f'],['2026-04-14','Ambedkar Jayanti','n'],['2026-05-01','Buddha Purnima · Labour Day','f'],['2026-05-28','Id-ul-Zuha (Bakrid)','f'],['2026-06-26','Muharram','f'],
['2026-07-16','Rath Yatra','r'],['2026-08-15','Independence Day','n'],['2026-08-26','Milad-un-Nabi','f'],['2026-08-28','Raksha Bandhan','r'],['2026-09-04','Janmashtami','f'],['2026-09-14','Ganesh Chaturthi','r'],
['2026-09-17','Vishwakarma Puja','r'],['2026-10-02','Gandhi Jayanti','n'],['2026-10-11','Navratri begins','r'],['2026-10-19','Maha Navami','r'],['2026-10-20','Dussehra','f'],['2026-10-29','Karwa Chauth','r'],
['2026-11-06','Dhanteras','r'],['2026-11-07','Naraka Chaturdashi','r'],['2026-11-08','Diwali','f'],['2026-11-24','Guru Nanak Jayanti','f'],['2026-12-25','Christmas','f'],
['2027-01-14','Makar Sankranti / Uttarayan','r'],['2027-01-26','Republic Day','n'],['2027-03-10','Id-ul-Fitr (Eid)','f'],['2027-03-23','Holi','f'],['2027-03-26','Good Friday','f'],['2027-04-14','Ambedkar Jayanti','n'],
['2027-04-15','Ram Navami','f'],['2027-04-19','Mahavir Jayanti','f'],['2027-05-17','Id-ul-Zuha (Bakrid)','f'],['2027-05-20','Buddha Purnima','f'],['2027-06-16','Muharram','f'],['2027-08-15','Independence Day','n'],
['2027-08-25','Janmashtami','f'],['2027-09-17','Vishwakarma Puja','r'],['2027-10-02','Gandhi Jayanti','n'],['2027-10-09','Dussehra','f'],['2027-10-29','Diwali','f'],['2027-11-14','Guru Nanak Jayanti','f'],['2027-12-25','Christmas','f']];
const QUOTES = ["One action, multiple solutions.","Safety first, production next – never the other way round.","A small check today prevents a big breakdown tomorrow.","Teamwork makes the toughest shutdown feel easy.","Do it right the first time, every time.","Discipline in the small things builds reliability in the big ones.","Every reading you record is a breakdown you may prevent.","Alone we repair, together we improve.","Stay curious. Every fault is a lesson.","Go home safe – that is the real target.","No job is so urgent that we cannot take time to do it safely.","Lock out, tag out, try out – then touch.","If you are not sure, stop and ask. Asking is strength.","A shortcut today can become a lifelong regret.","Your family is waiting for you – work safely for them.","Wear your PPE like you wear your pride.","Isolate. Verify. Then work. Every single time.","Near-miss reported today is an accident prevented tomorrow.","Be the reason your colleague goes home safe.","Hot strip, cool head.","Housekeeping is the first step of safety.","Look up, look down, look around – before you step in.","Safe work is smart work.","Never assume a panel is dead – test it.","Stand clear of the line when the mill is running.","Safety is not a department, it is everyone's duty.","Speak up for safety – it takes one second.","Good habits in safety are built on ordinary days.","The best repair is the one that never needs repeating.","Predict, prevent, perform.","Preventive maintenance is cheaper than breakdown maintenance.","A tidy panel is a reliable panel.","Measure twice, trip never.","Small leaks sink big ships – fix the small fault now.","Quality is remembering what to do when nobody is watching.","Trust the process, check the data.","Learn something new on every shift.","Consistency beats intensity.","Today's effort is tomorrow's uptime.","Ownership turns a job into a responsibility.","Respect the machine and it will respect your time.","Every shutdown completed safely is a team victory.","Great teams share knowledge, not just tasks.","Handover well – the next shift inherits your work.","Write down what you learn, so the next person starts higher.","Challenges are what make the shift interesting.","Keep calm in a breakdown – clear mind fixes faster.","Fix the root cause, not just the symptom.","Be proud of the steel you help make.","Steel is forged in heat – so is character.","Progress, not perfection.","Start where you are, use what you have, do what you can.","The only way to do great work is to love what you do.","Hard work beats talent when talent does not work hard.","Success is the sum of small efforts repeated daily.","Take pride in the quality of your work.","A positive mind keeps the whole shift running.","Never stop improving – even 1% a day adds up.","Let us make today safer than yesterday.","Courage is calling a stop when something looks wrong.","Respect every colleague – the plant runs on all of us.","Help a new joiner today – you were one once.","Think before you act, check before you start.","Compliance today, confidence tomorrow.","Zero harm is possible when everyone cares.","Work to a plan, and plan for safety.","Fatigue is a hazard – take your rest, stay alert.","Mobile in pocket, eyes on the job.","Use the right tool for the right job.","Keep walkways clear – the next step may be yours.","Gas, heat, height, voltage – respect them all.","Confined space, clear permit, trained person – no compromise.","Working at height? Harness on, hook on.","Hydraulic energy stored is energy waiting – release it safely.","Never bypass an interlock – it was put there for a reason.","A calm shift is a well-prepared shift.","Your signature on a permit is your promise of safety.","When in doubt, find out.","Every day is a new chance to get it right.","Gratitude for the team makes the work lighter.","Be the calm in the breakdown storm.","Technology changes, discipline stays.","Reliability is built one inspection at a time.","Sharing a lesson saves someone else a mistake.","Honest reporting builds a safe plant.","Think safe, act safe, be safe.","Live to work another day – follow the rules.","Courtesy on the shop floor costs nothing and saves a lot.","Great things in business are never done by one person.","What gets measured gets improved.","Be early, be prepared, be professional.","A strong team has no weak shift.","Learning never exhausts the mind.","Keep your tools clean and your mind clear.","The mill never sleeps – and neither does the need for safety.","Do not walk past a hazard – fix it or report it.","Work smart, stay safe, finish strong.","Your attention today protects someone tomorrow.","Every safe shift is a gift to your family.","Make safety a habit, not a reaction.","Energy isolation is life insurance.","It is okay to say \"I need help\".","Better to be late than to be hurt.","Check your own safety first, then help others.","The strength of the team is each individual member.","Respect time, respect process, respect people.","Simple actions, repeated daily, make great results.","Improve one thing today.","Finish what you start – and start it safely.","A good electrician reads the drawing before touching the wire.","Every alarm is a message – listen before you silence it.","Behind every trip there is a reason – find it.","Cables tell stories to those who inspect them.","A loose lug today is a fire tomorrow.","Tighten the connection, loosen the stress.","Check the earth, trust the protection.","An interlock saved is a life saved.","Dust is the silent enemy of every panel.","Heat in a joint is a warning – act before it speaks louder.","Thermography shows what eyes cannot.","Listen to the motor – it speaks before it fails.","Vibration is the heartbeat of a machine; know its normal rhythm.","A clean contact is a happy contact.","Label everything – your future self will thank you.","Document the change, or the change will confuse the next shift.","Backup the program before you change it.","Never trust a drawing you have not verified on site.","Test the spare before you need the spare.","A well-kept spare store is a calm breakdown.","Know your plant – every cable, every card, every cabinet.","Fault finding is detective work – be patient and logical.","Divide the problem in half, and half again – the fault must be somewhere.","The simplest cause is often the real cause – check it first.","When everything looks fine, look again.","A rushed repair is a repeated repair.","Take ten minutes to plan, save ten hours of rework.","Trust your instruments, but verify your instruments.","Calibration is confidence in numbers.","Numbers do not lie, but they need honest readers.","Record the reading as you see it, not as you wish it.","A true entry in the checklist is worth more than a perfect one.","Small deviations are loud warnings when noticed early.","Trends matter more than single readings.","Predictive today, productive tomorrow.","Reliability is a team sport.","Mean time between failures starts with mean attention to detail.","The best breakdown is the one that never happens.","Good maintenance is invisible – everything simply keeps running.","Pride in the plant begins with pride in the panel.","The coil does not stop; neither should our learning.","Rolling steel needs rolling improvements.","Every coil rolled safely is a promise kept.","Quality steel starts with quality attention.","The strip runs straight when the team pulls together.","Heat the steel, not the argument.","Mill stands strong because people stand together.","Production is a result; safety is the foundation.","Do not trade a minute of time for a lifetime of regret.","A moment of carelessness can undo years of careful work.","Safety rules are written from lessons learned the hard way.","Be the example others follow on the shop floor.","Leadership is doing the right thing when no one is watching.","Say thank you – it costs nothing and builds everything.","A kind word on a tough shift goes a long way.","Listen first, then speak, then act.","Disagree with ideas, not with people.","Admit a mistake early – it is the cheapest time to fix it.","Mistakes are proof that you are trying.","Ask the question you are afraid to ask – someone else needs the answer too.","Teach what you know, learn what you do not.","Seniors guide, juniors question, the plant improves.","Experience is a teacher that sends the bill after the lesson – learn from others' bills.","Be a student of your machine for life.","Curiosity is the engine of improvement.","Fresh eyes see new faults – welcome fresh eyes.","Every expert was once a beginner who did not quit.","Slow is smooth, smooth is safe, safe is fast.","Patience in a breakdown saves time.","Stay humble – the plant can always teach you something new.","Today is a good day to learn one new thing about your area.","Small steps taken daily beat big plans never started.","A habit built today pays dividends for years.","Discipline is choosing what you want most over what you want now.","Be so reliable that people stop double-checking.","Commit to the shift, not just the shift timing.","Punctuality is respect in action.","Handover is not a formality; it is a lifeline.","A clear handover is a gift to the next shift.","Write the note you would want to read at the start of your shift.","Communication is the cheapest safety device.","Over-communicate during shutdowns.","Share the plan, share the risk, share the success.","Know who is working where before you energise.","Permit to work is permission to think.","Tool box talk is five minutes that can save a life.","A good TBT starts a safe shift.","Listen to the TBT as if it were about you – it is.","Every hazard identified is a hazard half controlled.","HIRAC is not paperwork – it is a map of what can hurt us.","Risk assessed is risk reduced.","The best control is the one that removes the hazard.","PPE is the last line of defence – do not make it the only one.","Safety shoes protect only when worn.","A helmet on the head, not on the hook.","Gloves for the job, not for the pocket.","Safety glasses cost little; eyes cost everything.","Ear protection today, clear hearing tomorrow.","Hydrate in the heat – a thirsty mind slips.","Heat stress is real – take a break in the shade.","Eat well, sleep well, work well.","Rest is part of the job, not a break from it.","A clear mind is the best safety equipment.","Stretch before the shift, think before the task.","Lift with your legs, not your back.","Your back has to last forty years – treat it well.","Walk, do not run, on the mill floor.","Hold the handrail – gravity never takes a day off.","Slips, trips and falls are the commonest and the most avoidable.","Spill cleaned today is a fall prevented tomorrow.","A tidy area is a visible sign of a disciplined team.","5S: sort, set, shine, standardise, sustain.","Everything in its place makes everything faster.","Standard work is the best starting point for improvement.","First make it safe, then make it right, then make it quick.","Quality is everyone's job, not just the inspector's.","Right first time beats best second time.","Rework is the most expensive way to learn.","Waste hides in waiting, walking and searching.","Make the problem visible and half the work is done.","Ask why five times to reach the real cause.","Blame the process, fix the process, thank the people.","A problem shared is a problem half solved.","A good question beats a quick guess.","Data without action is just decoration.","Keep your logbook honest – it is the memory of the plant.","What is written gets done; what is spoken gets forgotten.","Follow the SOP – it holds the experience of those before us.","When the SOP is wrong, correct the SOP; never ignore it.","Procedures are written in the language of past mistakes.","Training is an investment, not an interruption.","Competence earns trust, trust earns freedom.","Know your limits and ask for help beyond them.","No one has ever been blamed for stopping an unsafe job.","Stop work authority is a duty, not a right.","You are the last safety check before the accident.","See something, say something, fix something.","Near misses are free lessons – collect them.","An accident is never an accident – it has causes we can remove.","Zero harm is a daily decision.","Live every shift as if your family were watching.","Home is the destination, work is the journey.","Make your family proud twice – with your work and your safe return.","Your children copy what you do, not what you say – set the example.","Spend time with the ones who wait for you.","Balance work and life – the plant will manage an hour without you.","Switch off the plant at the gate and switch on the family.","Health is wealth – check yours, too.","A walk after the shift clears the head.","A smile is a free tool for every toolbox.","Cheerful teams find faster solutions.","Gratitude turns routine into richness.","Be thankful for a day without incidents.","Celebrate small wins – they add up to big results.","Recognise good work aloud.","Praise in public, correct in private.","Treat the contractor as you would treat your own team.","One plant, one team, one goal.","Together Everyone Achieves More.","No department wins alone.","Cooperation between shifts is the secret of uptime.","When one shift hands over well, two shifts win.","The best team members make others better.","Collaboration turns problems into projects.","Diversity of experience solves more faults.","Respect the night shift – they keep the plant alive while others sleep.","Salute the people behind the scenes; the plant runs on them.","Thank the team that fixed it at 3 AM.","Courage is staying calm when the alarm is loudest.","In a crisis, slow down your breathing and speed up your thinking.","Panic is the enemy of the sharp mind.","Think in steps: isolate, identify, correct, confirm.","After every breakdown, ask: what did we learn?","Good judgement comes from experience; experience comes from bad judgement – share both.","Do not fear failure; fear not learning from it.","Resilience is bouncing back with better knowledge.","A setback is a setup for a comeback.","Fall seven times, stand up eight.","Persistence beats resistance.","The way to get started is to quit talking and begin doing.","It always seems impossible until it is done.","Well done is better than well said.","Quality is not an act, it is a habit.","Excellence is doing ordinary things extraordinarily well.","You do not have to be great to start, but you have to start to be great.","Stay hungry for knowledge.","An investment in knowledge pays the best interest.","The more you learn, the more you earn – and the safer you work.","Read the manual – it is the cheapest training available.","Technology serves those who understand it.","Automation is only as smart as the engineer behind it.","Sensors do not lie; wiring sometimes does.","Always know the normal, so you can spot the abnormal.","A logical mind and a patient heart – the tools of a good engineer.","Troubleshooting is the art of asking the right question.","Check the power supply first – it is the root of many faults.","Many a mystery was just a loose connector.","Reboot is not a solution; understanding is.","Trust, but verify – then document.","Version your programs and sleep better.","A change without a record is a future fault.","Test in a safe mode before running in the live mode.","Simulate the risk, not the accident.","Know the sequence before you force the output.","Never force an output without knowing what it moves.","Mechanical and electrical – two faces of the same machine.","Respect the process – it is the reason the plant exists.","Understand the process and the fault becomes clearer.","Every motor has a story – learn to read it.","Cooling is life for drives; clean the filters.","Ventilation is the breath of a panel.","Dust and moisture – the two thieves of reliability.","Oil is the blood of the mill – keep it clean.","Hydraulic pressure respects no mistakes.","A leak is a symptom; find the disease.","Keep the area clean and the faults will be easier to see.","Good lighting finds faults before they find you.","Inspect with all your senses – look, listen, smell, feel (safely).","Walk the line every day; the plant will tell you its secrets.","The routine round is the first line of defence.","Do the round as if it were the first, and the last, of the week.","Be present on your round – distraction misses the fault.","The checklist is not a burden; it is a safety net.","Every box ticked is a promise kept.","Never tick a box you did not check.","Honesty in the checklist is the foundation of reliability.","Out-of-range readings are an invitation to investigate.","Small changes in a trend say big things about the future.","Respect the red reading – it is trying to help you.","Act on abnormal today; do not carry it to tomorrow.","Escalate early, explain clearly, follow up closely.","Keep your supervisor informed, never surprised.","Truth travels faster than rumour when it is shared early.","Tomorrow's plan begins with today's handover.","Plan the job, brief the team, work the plan, review the result.","After the job, leave the area better than you found it.","Return every tool to its place and every guard to its position.","Replace the guard before you restart – always.","Check twice before you energise.","Lock your own lock; trust your own key.","Your lock, your key, your life.","Verify zero energy with your own meter.","A multimeter is the cheapest life insurance.","Test the tester before you test the circuit.","Ground it, test it, then touch it.","Respect high voltage – it gives no second chance.","Arc flash is instant; protection must be earlier.","Stay within the safe approach distance, always.","Never work alone on live equipment.","Two pairs of eyes are better than one on every critical job.","A buddy check takes a minute and saves a lifetime.","Be your brother's keeper on the shop floor.","Care for your colleagues like family.","We are one family in the same helmet.","Be kind – everyone on the shift is fighting some battle.","A peaceful mind makes fewer errors.","Take a deep breath before a critical switching.","Switching operations need full attention, not half.","Follow the switching sequence – every step, every time.","Confirm, repeat back, then act.","Three-way communication prevents wrong operations.","Use the radio clearly: who, where, what.","Silence on the radio can be as dangerous as noise.","Wait for the all-clear before you restart.","Never restart a tripped machine without knowing why it tripped.","Understand the trip, then reset.","The reset button is not a repair tool.","A warning ignored is a failure invited.","Observation today is prevention tomorrow.","Small improvements, big impact.","Kaizen: change for the better, one step at a time.","Ideas are free – share yours.","Suggest it, test it, own it.","Innovation begins with a simple question: can we do this better?","Make the job easier for the next person.","Simplify, then standardise.","Leave a trail of knowledge wherever you work.","Mentoring is the best legacy in an industry.","The best leaders create more leaders.","Pass the torch of knowledge to every new joiner.","Today's trainee is tomorrow's team leader.","Start the shift with intention, end it with reflection.","Each day builds the plant you will work in tomorrow.","A good shift is quiet – and quiet is the sound of success.","Aim for no news – the best news in maintenance.","Ten thousand safe shifts begin with one.","Be proud of the uptime you protect.","You are an important link in the chain that moves steel.","Behind every coil there is a team.","Thank you for keeping the Hot Strip Mill alive."];
// activity log: every change in any module is written to the cloud (fire and forget)
const logAct = (module, action, detail) => { try { if (typeof rpc === 'function' && SESSION) rpc('hsm_log', { p_module: module, p_action: action, p_detail: detail || null }).catch(() => {}); } catch (e) {} };

/* ================= SETTINGS (admin-changeable, shared by everyone) =================
 * low_stock {n}: spares below n are "low"; drive_folders [{k,l}]: extra Drive tabs; cl_limits {"CODE|sectionIndex": {hi, lo}}: red-alert range per check list section */
let SET = {}, LOWN = 5, CL_LIM = {};
function applySettings(m) {
  SET = m || {};
  const n = SET.low_stock && +SET.low_stock.n; LOWN = n >= 1 ? n : 5;
  CL_LIM = SET.cl_limits && typeof SET.cl_limits === 'object' ? SET.cl_limits : {};
  const f = SET.drive_folders; DRIVE_TABS = [...DRIVE_BASE, ...(Array.isArray(f) ? f.filter(x => x && x.k && x.l).map(x => [x.k, x.l]) : [])];
}
async function loadSettings() {
  try { const rows = await api('app_settings?select=key,value', { fresh: true }), m = {}; (rows || []).forEach(r => { m[r.key] = r.value; });
    if (JSON.stringify(m) !== JSON.stringify(SET)) { store.set('hsm_set', m); applySettings(m); return true; } } catch (e) {}
  return false;
}
let setInit = false;
function initSettings() { if (setInit) return; setInit = true; loadSettings().then(ch => { if (ch) softRerender(); }); }
window.clLim = (code, si) => limOf(code, si);
async function saveSetting(key, value) { await rpc('hsm_set_setting', { p_key: key, p_value: value }); const m = { ...SET, [key]: value }; store.set('hsm_set', m); applySettings(m); }
const limOf = (code, si) => { const l = CL_LIM[`${code}|${si}`] || {}; return { hi: l.hi != null && l.hi !== '' ? +l.hi : 100, lo: l.lo != null && l.lo !== '' ? +l.lo : null }; };

/* ================= ICONS ================= */
const I = {
  back:'<path d="M15 5l-7 7 7 7"/>', chev:'<path d="M9 5l7 7-7 7"/>',
  home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  check:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>',
  box:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  drive:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  folderplus:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v6M9 14h6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9.5 12.5h6M9.5 16.5h6"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  xls:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12l4 5M13 12l-4 5"/>',
  pin:'<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  ok:'<path d="M5 12l5 5 9-10"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
  hourglass:'<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  logout:'<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  upload:'<path d="M12 20V9M7 14l5-5 5 5"/><path d="M5 4h14"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  talk:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  plane:'<path d="M3 11l18-7-7 18-3-8z"/><path d="M11 14l10-10"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
  list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>',
  trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  wa:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/>'
};
const ic = (n, s = 24) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

/* ================= HELPERS ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fromYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtDay = d => `${pad2(d.getDate())}-${MON3[d.getMonth()]}-${String(d.getFullYear()).slice(2)}, ${DAY3[d.getDay()]}`;
const fmtShort = d => `${pad2(d.getDate())}-${MON3[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`;
const fmtStamp = iso => { const d = new Date(iso); return `${fmtShort(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const can = m => !ME || ME.is_admin || !Array.isArray(ME.modules) || ME.modules.includes(m) || (ME.admin_modules || []).includes(m);
// module admin: can upload / edit inside that module and sees all its areas
const isModAdmin = m => !!ME && (ME.is_admin || (ME.admin_modules || []).includes(m));
// area inside a module (check list areas, mill SOP areas): no list saved = all areas
const canArea = (m, a) => isModAdmin(m) || (can(m) && (!ME.areas || !Array.isArray(ME.areas[m]) || ME.areas[m].includes(a)));
const meFields = me => ({ name: me.name, username: me.username, is_admin: me.is_admin, role: me.role, modules: me.modules, avatar: me.avatar,
  areas: me.areas || {}, admin_modules: me.admin_modules || [], sap_id: me.sap_id || '' });
const avHtml = (url, name, style = '') => url
  ? `<span class="av" style="padding:0;overflow:hidden;${style}"><img src="${esc(url)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></span>`
  : `<span class="av" style="${style}">${esc(initials(name))}</span>`;
const initials = n => { const p = String(n || '?').replace(/\./g, '').trim().split(/\s+/); return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
const firstName = n => { const p = String(n || '').replace(/^s\.\s*/i, '').split(/\s+/); return p[0] || ''; };
const curShift = (d = new Date()) => { const h = d.getHours(); return h >= 7 && h < 15 ? 'A' : h >= 15 && h < 23 ? 'B' : 'C'; };
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const store = { get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
                set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
                del(k) { try { localStorage.removeItem(k); } catch (e) {} } };
const normName = n => String(n || '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\b(mr|mrs|ms)\b/g, '').trim().split(/\s+/).filter(w => w.length > 1);
function sameName(a, b) {
  const x = normName(a), y = normName(b); if (!x.length || !y.length) return false;
  if (x[0] !== y[0] && !(x[0].startsWith(y[0]) || y[0].startsWith(x[0]))) return false;
  if (x.length === 1 || y.length === 1) return true;
  const lx = x[x.length - 1], ly = y[y.length - 1];
  return lx === ly || lx.startsWith(ly) || ly.startsWith(lx);
}

let toastT;
function toast(msg, ms = 3000) { const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), ms); }
function ask(title, text, okLabel = 'OK', cancelLabel = 'Cancel', danger = false) {
  return new Promise(res => {
    const m = $('#modal');
    m.innerHTML = `<div class="sheet"><h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}
      <div class="two"><button class="btn ghost" data-r="0">${esc(cancelLabel)}</button><button class="btn ${danger ? 'pri' : 'pri'}" data-r="1">${esc(okLabel)}</button></div></div>`;
    m.classList.remove('hidden');
    m.onclick = e => { const b = e.target.closest('[data-r]'); if (!b && e.target !== m) return; m.classList.add('hidden'); m.onclick = null; res(!!b && b.dataset.r === '1'); };
  });
}

/* ================= AUTH + API ================= */
let SESSION = store.get('hsm_session');   // {access_token, refresh_token, expires_at}
let ME = store.get('hsm_me');             // {name, username, is_admin}

/* Network: time-out so a weak signal (basement / cellar) fails fast instead of hanging */
const isNet = e => !!e && /Failed to fetch|NetworkError|Load failed|network|timed out|abort/i.test(e.message || e.name || '');
function tfetch(url, opts = {}, ms = 12000) {
  if (navigator.onLine === false) return Promise.reject(new Error('network offline'));
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  return fetch(url, { ...opts, signal: c.signal }).catch(e => { throw new Error(e.name === 'AbortError' ? 'network timed out' : (e.message || 'network error')); })
    .finally(() => clearTimeout(t));
}
/* Offline copies of what was last seen, so the app still works without network */
const CACHE_OK = /^(checklist_templates|team|shift_roster|sop_hirac|sops|spares|spare_log|hirac|checklist_entries|app_settings|contacts|tbt)\b/;
/* Cache-first (instant) reads: show the last copy at once, refresh from the cloud in the background and redraw only if it changed */
const SWR_OK = /^(checklist_templates|team|shift_roster|sop_hirac|sops|spares|hirac|app_settings|contacts|tbt)\b/;
const CKEY = 'hsm_c:';
function cachePut(path, data) {
  try { const s = JSON.stringify(data); if (s.length > 1200000) return;
    const idx = store.get('hsm_cidx', []).filter(p => p !== path); idx.push(path);
    while (idx.length > 80) store.del(CKEY + idx.shift());
    localStorage.setItem(CKEY + path, s); store.set('hsm_cidx', idx);
  } catch (e) {}
}
const cacheGet = path => store.get(CKEY + path);
let OFFLINE = false;
function setOffline(v) {
  if (OFFLINE === v) return; OFFLINE = v;
  document.body.classList.toggle('offline', v);
  let b = $('#offbar');
  if (v && !b) { b = document.createElement('div'); b.id = 'offbar'; b.setAttribute('role', 'status');
    b.textContent = 'Offline · check lists are saved on this phone'; document.body.appendChild(b); }
  if (!v && b) b.remove();
}

async function gotrue(path, body) {
  const r = await tfetch(`${SB_URL}/auth/v1/${path}`, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error_description || j.msg || j.message || `Sign-in failed (${r.status})`);
  return j;
}
function saveSession(j) {
  SESSION = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || (Math.floor(Date.now() / 1000) + (j.expires_in || 3600)) };
  store.set('hsm_session', SESSION);
}
let refreshing = null;
async function accessToken(force) {
  if (!SESSION) throw new Error('AUTH');
  if (force || SESSION.expires_at - 60 < Date.now() / 1000) {
    refreshing = refreshing || gotrue('token?grant_type=refresh_token', { refresh_token: SESSION.refresh_token })
      .then(saveSession).finally(() => { refreshing = null; });
    try { await refreshing; } catch (e) { if (isNet(e)) throw e; logout(true); throw new Error('AUTH'); }
  }
  return SESSION.access_token;
}
async function apiNet(path, opts = {}, retry = true) {
  const tok = opts.anon ? null : await accessToken();
  const headers = { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: opts.prefer || 'return=representation' };
  if (tok) headers.Authorization = `Bearer ${tok}`;
  const res = await tfetch(`${SB_URL}/rest/v1/${path}`, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (res.status === 401 && retry && !opts.anon) { await accessToken(true); return apiNet(path, opts, false); }
  const txt = await res.text(); let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
  if (!res.ok) throw new Error((data && (data.message || data.hint)) || `Error ${res.status}`);
  return data;
}
const reval = {};
function revalidate(path, old) {
  if (reval[path]) return; reval[path] = 1;
  apiNet(path).then(d => { setOffline(false); if (JSON.stringify(d) !== JSON.stringify(old)) { cachePut(path, d); softRerender(); } })
    .catch(e => { if (isNet(e)) setOffline(true); }).finally(() => { delete reval[path]; });
}
function bustCache() { try { store.get('hsm_cidx', []).forEach(p => store.del(CKEY + p)); store.set('hsm_cidx', []); } catch (e) {} }
const WRITE_RPC = /^rpc\/(adjust|hsm_(set|add|edit|decide|spare|leave|sc_(apply|cancel|decide|revoke|set)|upload|publish|admin))/;
const SAFE_REFRESH = new Set(['home', 'schedule', 'spares', 'sop', 'hirac', 'team', 'contacts', 'tbt', 'checklist']);
let rerT;
function softRerender() {
  clearTimeout(rerT); rerT = setTimeout(() => {
    const h = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    if (!SESSION || !ME || !SAFE_REFRESH.has(h[0]) || (h[0] === 'hirac' && h[1])) return;
    const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    const md = $('#modal'); if ((md && !md.classList.contains('hidden')) || $('#docv')) return;
    const m0 = document.querySelector('main.scroll'), sy = m0 ? m0.scrollTop : 0, tab = document.querySelector('.tabs .on');
    render();
    if (sy) [150, 450].forEach(t => setTimeout(() => { const m = document.querySelector('main.scroll'); if (m) m.scrollTop = sy; }, t));
  }, 200);
}
async function api(path, opts = {}) {
  const get = !opts.method || opts.method === 'GET';
  if (get && !opts.prefer && !opts.fresh && SWR_OK.test(path) && !/select=\*/.test(path)) {
    const c = cacheGet(path); if (c != null) { revalidate(path, c); return c; }
  }
  try {
    const d = await apiNet(path, opts);
    setOffline(false); if (get && CACHE_OK.test(path) && !opts.prefer) cachePut(path, d);
    if (!get && (!/^rpc\//.test(path) || WRITE_RPC.test(path))) bustCache();
    if (outbox().length) setTimeout(flushOutbox, 300);
    return d;
  } catch (e) {
    if (!isNet(e)) throw e;
    setOffline(true);
    if (get && !opts.prefer) { const c = cacheGet(path); if (c != null) return c; }
    throw e;
  }
}
const rpc = (fn, args = {}, anon = false) => api(`rpc/${fn}`, { method: 'POST', body: args, anon });
const netErr = e => { if (e && e.message === 'AUTH') return; toast(isNet(e) ? 'No network. Check connection and try again.' : e.message); };

/* ================= OFFLINE OUTBOX (check lists) =================
 * A submitted check list is saved on the phone first, then uploaded. With no network it waits here
 * and uploads by itself as soon as the network is back (app open, or next start). client_id stops duplicates. */
const OBX = 'hsm_outbox';
const outbox = () => store.get(OBX, []);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
let flushing = null;
function flushOutbox() {
  if (flushing || !SESSION) return flushing;
  flushing = (async () => {
    let sent = 0;
    for (const item of outbox()) {
      try {
        await apiNet('checklist_entries?on_conflict=client_id', { method: 'POST', body: item.body, prefer: 'resolution=ignore-duplicates,return=minimal' });
        store.set(OBX, outbox().filter(x => x.body.client_id !== item.body.client_id)); sent++;
      } catch (e) { if (isNet(e) || e.message === 'AUTH') { setOffline(isNet(e)); break; } item.err = e.message; store.set(OBX, outbox().map(x => x.body.client_id === item.body.client_id ? item : x)); }
    }
    if (sent) { setOffline(false); toast(`${sent} check list${sent > 1 ? 's' : ''} uploaded`);
      const h = location.hash.replace(/^#\/?/, '') || 'home'; if (h === 'checklist' || h === 'home') render(); }
    return sent;
  })().finally(() => { flushing = null; });
  return flushing;
}
window.addEventListener('online', () => { setOffline(false); setTimeout(flushOutbox, 1500); });
window.addEventListener('offline', () => setOffline(true));
document.addEventListener('visibilitychange', () => { if (!document.hidden && outbox().length) flushOutbox(); });
setInterval(() => { if (outbox().length && navigator.onLine !== false) flushOutbox(); }, 45000);
const obxEntries = day => outbox().map(x => ({ ...x.body, id: 'local:' + x.body.client_id, created_at: x.body.filled_at, local: true })).filter(r => !day || r.check_date === day);

function logout(expired) {
  try { if (window.HSMNative && HSMNative.disableNotifications) HSMNative.disableNotifications(); } catch (e) {}
  notifyDone = false;
  SESSION = null; ME = null; store.del('hsm_session'); store.del('hsm_me');
  if (expired) toast('Please sign in again');
  location.hash = ''; render();
}

/* Storage (SOP documents) */
async function storageList(prefix, bucket = SOP_BUCKET) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/list/${bucket}`, { method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } }) });
  if (!r.ok) throw new Error('Could not load documents');
  return r.json();
}
async function storageSignedUrl(path, bucket = SOP_BUCKET) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/sign/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`, { method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 3600 }) });
  const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Could not open document');
  return `${SB_URL}/storage/v1${j.signedURL || j.signedUrl}`;
}
async function storageUpload(path, file, bucket = SOP_BUCKET, upsert = false) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`, { method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': upsert ? 'true' : 'false' }, body: file });
  if (!r.ok) { const j = await r.json().catch(() => ({})); const ex = /exist|duplicate/i.test((j.message || '') + (j.error || '')); const e = new Error(ex ? 'A file with this name already exists' : (j.message || 'Upload failed')); e.exists = ex; throw e; }
}
async function storageDelete(path, bucket) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/${bucket}`, { method: 'DELETE',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [path] }) });
  const j = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(j) || !j.length) throw new Error('Could not delete');
}
const myUid = () => { try { return JSON.parse(atob(SESSION.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub; } catch (e) { return null; } };
let AVATARS = null;
async function avatars() { if (!AVATARS) { try { AVATARS = await rpc('hsm_avatars') || []; } catch (e) { return []; } } return AVATARS; }
function squarePhoto(file, size = 400) {
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const s = Math.min(im.naturalWidth, im.naturalHeight), c = document.createElement('canvas'); c.width = c.height = size;
      c.getContext('2d').drawImage(im, (im.naturalWidth - s) / 2, (im.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url); c.toBlob(b => b ? ok(b) : no(new Error('Could not read photo')), 'image/jpeg', 0.85); };
    im.onerror = () => { URL.revokeObjectURL(url); no(new Error('Could not read this photo. Use a JPG or PNG.')); };
    im.src = url;
  });
}
async function setMyPhoto(file) {
  const uid = myUid(); if (!uid) throw new Error('AUTH');
  toast('Saving photo…', 15000);
  const blob = await squarePhoto(file);
  await storageUpload(`${uid}.jpg`, new File([blob], 'photo.jpg', { type: 'image/jpeg' }), 'avatars', true);
  const url = `${SB_URL}/storage/v1/object/public/avatars/${uid}.jpg?v=${Date.now()}`;
  await rpc('hsm_set_avatar', { p_url: url }); logAct('profile', 'Profile photo changed', ME.name);
  ME.avatar = url; store.set('hsm_me', ME); AVATARS = null; toast('Photo updated');
}

/* Files: save + share (Android) or download (browser) */
function toB64(buf) { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function deliver(buf, name, share) {
  if (window.HSMNative && HSMNative.saveFile) {
    const r = HSMNative.saveFile(toB64(buf), name, XLSX_MIME, !!share);
    if (String(r).startsWith('ok:')) toast(`Saved to ${String(r).slice(3)}`); else toast('Could not save file: ' + r);
    return;
  }
  // iPhone / browser: share sheet (Mail, Outlook, WhatsApp, Files…) when possible, else download
  const file = typeof File === 'function' ? new File([buf], name, { type: XLSX_MIME }) : null;
  if (share && file && navigator.canShare && navigator.canShare({ files: [file] })) {
    const doShare = () => navigator.share({ files: [file], title: name }).catch(e => { if (e && e.name !== 'AbortError') toast('Could not share: ' + e.message); });
    // iOS needs a fresh tap after the file is built
    const m = $('#modal');
    m.innerHTML = `<div class="sheet"><div class="status" style="padding:0"><div class="ring" style="background:var(--green-50);color:var(--green)">${ic('xls', 40)}</div><h2>Excel ready</h2><p>${esc(name)}</p></div>
      <button class="btn pri block" id="wshare">${ic('share')} Share / Mail</button><button class="btn ghost block" id="wclose">Close</button></div>`;
    m.classList.remove('hidden');
    $('#wshare').onclick = () => { doShare(); m.classList.add('hidden'); };
    $('#wclose').onclick = () => m.classList.add('hidden');
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf], { type: XLSX_MIME })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Downloaded ' + name);
}
function openLink(url) { if (window.HSMNative && HSMNative.openUrl) HSMNative.openUrl(url); else window.open(url, '_blank'); }
/* ================= DOCUMENT VIEWER (in-app, no download) ================= */
const loadScript = src => new Promise((ok, no) => { if (document.querySelector(`script[data-lib="${src}"]`)) return ok();
  const t = document.createElement('script'); t.src = src; t.dataset.lib = src; t.onload = ok; t.onerror = () => { t.remove(); no(new Error('Viewer could not load')); }; document.head.appendChild(t); });
function closeDoc() { const v = $('#docv'); if (v) { v.remove(); document.body.style.overflow = ''; if (window.HSMNative && HSMNative.secure) { try { HSMNative.secure(false); } catch (e) {} } } }
window.addEventListener('popstate', () => { if ($('#docv')) closeDoc(); });
// Search inside an HTML document (Word / Excel preview): marks every match, next / previous
function docSearchInit(body) {
  const q = $('#dvq'), cnt = $('#dvc'); let marks = [], cur = -1, last = '';
  const clear = () => { marks.forEach(m => { const p = m.parentNode; if (p) { p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); } }); marks = []; cur = -1; };
  const show = i => { if (!marks.length) return; if (cur >= 0 && marks[cur]) marks[cur].classList.remove('cur'); cur = (i + marks.length) % marks.length;
    const m = marks[cur]; m.classList.add('cur'); m.scrollIntoView({ block: 'center', behavior: 'smooth' }); cnt.textContent = `${cur + 1} / ${marks.length}`; };
  const run = () => { const v = q.value.trim().toLowerCase(); if (v === last) return; last = v; clear(); if (v.length < 2) { cnt.textContent = ''; return; }
    const w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.toLowerCase().includes(v) && !/^(SCRIPT|STYLE)$/.test(n.parentNode.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => { const txt = n.nodeValue, low = txt.toLowerCase(), fr = document.createDocumentFragment(); let p = 0, i;
      while ((i = low.indexOf(v, p)) >= 0) { if (i > p) fr.appendChild(document.createTextNode(txt.slice(p, i))); const m = document.createElement('mark'); m.className = 'hlm'; m.textContent = txt.slice(i, i + v.length); fr.appendChild(m); marks.push(m); p = i + v.length; }
      if (p < txt.length) fr.appendChild(document.createTextNode(txt.slice(p))); n.parentNode.replaceChild(fr, n); });
    if (!marks.length) { cnt.textContent = 'No match'; return; } show(0); };
  $('#dv-s').onclick = () => { const s = $('#dvs'); s.classList.toggle('hidden'); if (!s.classList.contains('hidden')) q.focus(); };
  let tm; q.oninput = () => { clearTimeout(tm); tm = setTimeout(run, 350); };
  q.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); if (q.value.trim().toLowerCase() === last && marks.length) show(cur + 1); else run(); q.blur(); } };
  $('#dvn').onclick = () => show(cur + 1); $('#dvp').onclick = () => show(cur - 1);
  return { reset: () => { last = ''; marks = []; cur = -1; cnt.textContent = ''; if (q.value.trim()) run(); } };
}
async function openDoc(path, bucket) {
  const name = path.split('/').pop(), ext = (name.split('.').pop() || '').toLowerCase();
  if (ext === 'pdf') return openDriveDoc(path, bucket);
  if (!['docx', 'xlsx', 'jpg', 'jpeg', 'png'].includes(ext)) { toast('This file type cannot be opened inside the app. Ask the admin to upload it as PDF.', 5000); return; }
  closeDoc();
  const textual = ext === 'docx' || ext === 'xlsx';
  const v = document.createElement('div'); v.id = 'docv';
  v.innerHTML = `<header class="bar"><h1 style="font-size:17px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(name.replace(/\.[^.]+$/, ''))}</h1>${textual ? `<button class="ib" id="dv-s" aria-label="Search in document">${ic('search', 26)}</button>` : ''}<button class="ib" id="docx-close" aria-label="Close">${ic('x', 28)}</button></header>
    ${textual ? `<div class="dvs hidden" id="dvs"><input id="dvq" type="search" placeholder="Search text in this document" autocomplete="off"><span id="dvc" class="dvc"></span>
      <button class="ib dvu" id="dvp" aria-label="Previous match">${ic('chev', 22)}</button><button class="ib dvd" id="dvn" aria-label="Next match">${ic('chev', 22)}</button></div>` : ''}
    <div id="docb"><div class="spin">Opening…</div></div>`;
  ['contextmenu', 'dragstart', 'copy', 'cut'].forEach(t => v.addEventListener(t, e => e.preventDefault()));
  document.body.appendChild(v); document.body.style.overflow = 'hidden';
  history.pushState({ docv: 1 }, '');
  $('#docx-close').onclick = () => history.back();
  const body = $('#docb'), live = () => document.body.contains(body);
  try {
    const url = await storageSignedUrl(path, bucket);
    const res = await fetch(url); if (!res.ok) throw new Error('Could not open document');
    const buf = await res.arrayBuffer(); if (!live()) return;
    if (ext === 'docx') {
      await loadScript('lib/jszip.min.js'); await loadScript('lib/docx-preview.min.js');
      body.innerHTML = '';
      await docx.renderAsync(buf, body, null, { inWrapper: false, ignoreWidth: true, ignoreHeight: true, ignoreLastRenderedPageBreak: true, useBase64URL: false, renderHeaders: true, renderFooters: false });
      // phone layout: pictures sit in line with the text, so the blank lines Word left for floating pictures are not needed
      body.querySelectorAll('section.docx img').forEach(img => { const d = img.parentElement; if (img.style.width) img.style.maxWidth = img.style.width;
        if (d && d.tagName === 'DIV') Object.assign(d.style, { position: 'static', display: 'block', width: 'auto', height: 'auto', top: 'auto', left: 'auto', margin: '8px 0' }); });
      body.querySelectorAll('section.docx p').forEach(p => { const empty = x => x && x.tagName === 'P' && !x.textContent.trim() && !x.querySelector('img,svg,table');
        if (empty(p) && empty(p.previousElementSibling)) p.remove(); });
      docSearchInit(body);
    } else if (ext === 'xlsx') {
      const wb = new ExcelJS.Workbook(); await wb.xlsx.load(buf); if (!live()) return;
      const sheets = wb.worksheets.filter(w => w.state !== 'hidden' && w.rowCount);
      if (!sheets.length) { body.innerHTML = '<div class="empty"><b>This workbook is empty</b></div>'; return; }
      let cur = 0; const srch = docSearchInit(body);
      const cellTxt = c => { const x = xv(c.value); if (x == null) return ''; if (x instanceof Date) return fmtShort(x); return typeof x === 'number' ? String(Math.round(x * 1e6) / 1e6) : String(x).replace(/\s+$/, ''); };
      const drawSheet = () => { const ws = sheets[cur], rows = Math.min(ws.rowCount, 1500), cols = Math.min(ws.columnCount, 40); let h = '';
        for (let r = 1; r <= rows; r++) { const row = ws.getRow(r); let tds = '', any = false;
          for (let c = 1; c <= cols; c++) { const cell = row.getCell(c); if (cell.isMerged && cell.master && cell.master.address !== cell.address) continue; const t = cellTxt(cell); if (t) any = true;
            tds += `<td>${esc(t)}</td>`; }
          if (any) h += `<tr>${tds}</tr>`; }
        body.innerHTML = `${sheets.length > 1 ? `<div class="xtabs">${sheets.map((w, i) => `<button data-i="${i}" class="${i === cur ? 'on' : ''}">${esc(w.name)}</button>`).join('')}</div>` : ''}<div class="xsheet"><table>${h || '<tr><td>(empty sheet)</td></tr>'}</table></div>`;
        $$('.xtabs button', body).forEach(b => b.onclick = () => { cur = +b.dataset.i; drawSheet(); srch.reset(); }); };
      drawSheet();
    } else {
      const img = new Image(); img.src = URL.createObjectURL(new Blob([buf])); img.style.cssText = 'width:100%;display:block'; body.innerHTML = ''; body.appendChild(img);
    }
  } catch (e) { if (live()) body.innerHTML = `<div class="empty"><b>Could not open this document</b>${esc(isNet(e) ? 'Check the network and try again.' : e.message)}</div>`; }
}
let XL = null;
function xl() {
  if (!XL) {
    if (!window.ExcelJS || !window.HSMXL) throw new Error('Excel module not loaded');
    XL = HSMXL.make(ExcelJS, async f => (await fetch(`xl/${f}`)).arrayBuffer());
  }
  return XL;
}

/* ================= DATA CACHES ================= */
let TPL = null, HIRAC = null, TEAM = null;
// Check list templates: the cloud says which ones this person may use (area access); the layout of each
// (sections, fields, Excel cells) ships with the app together with the Excel sheets in www/xl/.
let LOCAL_TPL = null;
async function localTemplates() { if (!LOCAL_TPL) { const r = await fetch('xl/templates.json'); if (!r.ok) throw new Error('Check list files missing – update the app'); LOCAL_TPL = await r.json(); } return LOCAL_TPL; }
async function templates() {
  if (!TPL) {
    const [rows, local] = await Promise.all([api('checklist_templates?select=code,name,area,sort,file,sheet&order=sort'), localTemplates()]);
    TPL = (rows || []).map(r => { const l = local.find(x => x.code === r.code); return l ? Object.assign({}, l, r) : null; }).filter(Boolean);
  }
  return TPL;
}
async function hiracData() {
  if (!HIRAC) {
    // HIRAC register comes from the cloud (approved login only) and is kept on the phone for offline use
    const db = await api('hirac?select=no,title,ref,rev,eff_date,review_date,owner,sop_ref,activities,hazards&order=no');
    const list = (db || []).map(h => ({ no: h.no, title: h.title, ref: h.ref, rev: h.rev, eff: h.eff_date, review: h.review_date, owner: h.owner, sop: h.sop_ref, acts: h.activities, hz: h.hazards }));
    if (!list.length) return list;
    HIRAC = list;
  }
  return HIRAC;
}
async function team() { if (!TEAM) TEAM = await api('team?select=id,name,area,role,plant,company,mobile,email,sap_id&order=name'); return TEAM; }
const itemCount = t => t.sections.reduce((n, s) => n + s.items.reduce((m, it) => m + it.cells.filter(Boolean).length, 0), 0);
const ftype = (s, it, fi) => window.HSMXL ? HSMXL.fieldType(s, it, fi) : (it.t || (s.fields[fi] || {}).t || 's');
const isHot = (t, v, lim) => { if (t !== 't' || v == null || v === '' || isNaN(parseFloat(v))) return false; const x = parseFloat(v), l = lim || { hi: 100, lo: null }; return x > l.hi || (l.lo != null && x < l.lo); };
const clAreaName = a => (CL_AREAS.find(x => x[0] === a) || [a, a])[1];

/* ================= ROUTER ================= */
const S = { spareArea: SPARE_AREAS[0], spareQuery: '', spareLow: false, sopTab: 'numbers', sopGroup: 'All', sopQuery: '', docArea: 'CB',
            calMonth: null, calSel: null, schedEdit: false, clArea: null, tbtArea: null, contactQuery: '', tbtQuery: '', teamQuery: '', reqTab: 'pending', reportDate: null, millArea: 'CB' };
const go = h => { location.hash = h; };
window.addEventListener('hashchange', render);
document.addEventListener('click', e => {
  const lg = e.target.closest('[data-log]'); if (lg) { S.actOnly = lg.dataset.log; S.actMod = lg.dataset.log; S.actBack = (location.hash.replace(/^#\/?/, '') || 'home'); go('activity'); return; }
  const g = e.target.closest('[data-go]'); if (g) { if (g.dataset.go === 'activity') { S.actOnly = null; S.actMod = 'all'; } go(g.dataset.go); return; }
  const b = e.target.closest('[data-back]'); if (b) { if (history.length > 1) history.back(); else go(b.dataset.back); }
});
window.hsmBack = () => {
  if ($('#docv')) { history.back(); return true; }
  if (!$('#modal').classList.contains('hidden')) { $('#modal').classList.add('hidden'); return true; }
  const h = location.hash.replace(/^#\/?/, ''); if (!h || h === 'home' || !SESSION) return false; history.back(); return true;
};

let meFresh = false;
let notifyDone = false;
async function initNotify() {
  if (notifyDone || !SESSION || !ME || ME.need_pin) return;
  if (!(window.HSMNative && HSMNative.enableNotifications)) return;
  notifyDone = true;
  try { const k = await rpc('hsm_notify_key'); if (k) HSMNative.enableNotifications(k); } catch (e) { notifyDone = false; }
}
async function refreshMe() {
  if (meFresh || !SESSION || !ME) return; meFresh = true;
  try {
    const me = await rpc('hsm_me'); if (!me) return;
    const key = () => JSON.stringify([ME.modules, ME.avatar, ME.is_admin, ME.name, ME.areas, ME.admin_modules]), before = key();
    Object.assign(ME, meFields(me));
    store.set('hsm_me', ME);
    if (key() !== before) render();
  } catch (e) { meFresh = false; }
}
function render() {
  window.scrollTo(0, 0);
  const md = $('#modal'); if (md && !md.classList.contains('hidden')) { md.classList.add('hidden'); md.onclick = null; }
  if (!SESSION || !ME) return viewLogin();
  refreshMe(); initNotify(); initSettings();
  if (ME.need_pin) return viewSetPin(false);
  const h = location.hash.replace(/^#\/?/, '') || 'home';
  const [page, ...rest] = h.split('/'); const arg = decodeURIComponent(rest.join('/'));
  const routes = { home: viewHome, schedule: viewSchedule, checklist: viewChecklist, cl: () => viewChecklistFill(arg), clh: () => viewChecklistHistory(arg),
    cle: () => viewChecklistEntry(arg), actions: viewActions, activity: viewActivity, clearlogs: viewClearLogs, spares: viewSpares, spare: () => viewSpare(arg), sop: viewSop, hirac: () => viewHirac(arg), team: viewTeam,
    clset: viewClSettings, approvals: viewApprovals, user: () => viewUser(arg), pin: () => viewSetPin(true), profile: viewProfile, mill: viewMillProcessSops, drive: () => viewDrive(arg), admin: viewAdmin,
    contacts: viewContacts, tbt: viewTbt, leave: viewLeave, suggest: viewSuggest, about: viewAbout, approval: viewApprovalHub };
  if (ROUTE_MOD[page] && !can(ROUTE_MOD[page])) { toast('You do not have access to this module'); history.replaceState(null, '', '#home'); return viewHome(); }
  (routes[page] || viewHome)();
}
const logBtn = m => (ME && (ME.is_admin || isModAdmin(m))) ? `<button class="ib" data-log="${m}" aria-label="Activity log of this module">${ic('list', 24)}</button>` : '';
const bar = (title, backTo, extra = '') => `<header class="bar">${backTo ? `<button class="ib back" aria-label="Back" data-back="${backTo}">${ic('back', 26)}</button>` : ''}<h1>${esc(title)}</h1>${extra}</header>`;
const nav = on => `<nav class="nav" aria-label="Main">${[['home','home','Home'],['schedule','cal','Schedule'],['checklist','check','Check List'],['suggest','bulb','Suggestions']].filter(([k]) => k === 'home' || k === 'suggest' || can(k))
  .map(([k, i, l]) => `<button class="${on === k ? 'on' : ''}" data-go="${k}" ${on === k ? 'aria-current="page"' : ''}><span class="pill">${ic(i, 24)}</span>${l}</button>`).join('')}</nav>`;

/* ================= LOGIN / APPROVAL ================= */
function device() {
  let id = '', name = '';
  try { if (window.HSMNative && HSMNative.deviceId) { id = HSMNative.deviceId(); name = HSMNative.deviceName(); } } catch (e) {}
  if (!id) { id = store.get('hsm_devid'); if (!id) { id = 'web-' + Math.random().toString(36).slice(2) + Date.now().toString(36); store.set('hsm_devid', id); }
    const ua = navigator.userAgent; name = (/Android[^;)]*;\s*([^;)]+)/.exec(ua) || [])[1] || (/Windows|Mac|iPhone|iPad/.exec(ua) || ['Browser'])[0]; name += IS_IOS && STANDALONE ? ' (app)' : ' (browser)'; }
  return { id, name };
}
const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const IOS_SAFARI = IS_IOS && !STANDALONE && !window.HSMNative;
let pendingCreds = null;
function viewLogin(state) {
  const st = state || (pendingCreds ? pendingCreds.kind : 'login');
  $('#app').innerHTML = `<div class="login">
    <div class="top"><div class="mk" style="padding:0;overflow:hidden;background:#140806"><img src="img/coil.png" alt="" style="width:100%;height:100%"></div><h1>HSM E&amp;A</h1><p>Electrical &amp; Automation · Hot Strip Mill</p></div>
    <div class="sheet" id="lsheet"></div></div>`;
  const sh = $('#lsheet');
  if (st === 'pending' || st === 'new_device') {
    const nd = st === 'new_device';
    sh.innerHTML = `<div class="status"><div class="ring">${ic(nd ? 'warn' : 'hourglass', 40)}</div><h2>${nd ? 'New phone – approval needed' : 'Waiting for approval'}</h2>
      <p>${nd ? `Your account is registered on another phone${pendingCreds.current ? ` (${esc(pendingCreds.current)})` : ''}. ${esc(ADMIN_NAME)} must approve this phone before you can use it here. The other phone will be signed out.`
              : `Hi ${esc(firstName(pendingCreds.name))}, your request has been sent. ${esc(ADMIN_NAME)} needs to approve it before you can open the app.`}</p></div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:22px">
        <button class="btn pri block" id="lcheck">${ic('refresh')} Check again</button>
        <button class="btn block" id="lmail">${ic('mail')} Email the approver</button>
        <button class="btn ghost block" id="lback">Use a different login</button></div>`;
    $('#lcheck').onclick = () => doLogin(pendingCreds.user, pendingCreds.pass, true);
    $('#lmail').onclick = () => mailApprover(pendingCreds);
    $('#lback').onclick = () => { pendingCreds = null; viewLogin('login'); };
    return;
  }
  sh.innerHTML = `<form class="f" id="lf" style="padding:0" autocomplete="on">
    <div style="font-size:21px;font-weight:700">Sign in</div>
    <div id="lerr"></div>
    <div class="fld"><label for="lu">Username</label><input id="lu" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="Domain username (e.g. sagrawal9)" value="${esc(store.get('hsm_lastuser', ''))}"></div>
    <div class="fld"><label for="lp">SAP ID or PIN</label><input id="lp" type="password" inputmode="text" autocomplete="current-password" placeholder="SAP ID first time, then your PIN"></div>
    <button class="btn pri block" type="submit" id="lsub">Sign in</button>
    <p class="hint" style="margin:4px 2px 0;line-height:1.45">First time: domain username + SAP ID. You will then set your own PIN and use it from then on. No domain username? Enter your SAP ID in the username box. Your account works only on your own phone.</p>
  </form>${IOS_SAFARI ? `<div class="iosTip"><b>iPhone: install the app first.</b> Tap the Share button <span aria-hidden="true">⬆</span> at the bottom of Safari, then <b>Add to Home Screen</b>. Open <b>HSM E&amp;A</b> from your home screen and sign in there.</div>` : ''}`;
  $('#lf').onsubmit = e => { e.preventDefault(); doLogin($('#lu').value, $('#lp').value); };
}
async function doLogin(user, pass, recheck) {
  user = String(user || '').trim(); pass = String(pass || '').trim();
  const err = m => { const el = $('#lerr'); if (el) el.innerHTML = `<div class="err">${esc(m)}</div>`; else toast(m); };
  if (!user || !pass) return err('Enter username and SAP ID / PIN');
  const btn = $('#lsub') || $('#lcheck'); if (btn) btn.disabled = true;
  const dev = device();
  try {
    const r = await rpc('hsm_login', { p_user: user, p_pass: pass, p_device_id: dev.id, p_device_name: dev.name }, true);
    store.set('hsm_lastuser', user);
    if (r.status === 'invalid' || r.status === 'locked') {
      pendingCreds = null; viewLogin('login');
      return err(r.status === 'locked' ? 'Too many wrong attempts. Try again after 15 minutes.'
        : r.pin ? 'Wrong PIN. If you forgot it, ask ' + ADMIN_NAME + ' to reset it.' : 'Username or SAP ID is not correct, or you are not on the approved list.');
    }
    if (r.status === 'pending' || r.status === 'new_device') {
      const first = !pendingCreds && (r.was === 'none' || r.status === 'new_device');
      pendingCreds = { user, pass, name: r.name, kind: r.status, current: r.current, device: dev.name };
      viewLogin(r.status);
      if (recheck) toast('Still waiting for approval');
      if (first) mailApprover(pendingCreds);
      return;
    }
    const j = await gotrue('token?grant_type=password', { email: r.email, password: r.secret });
    saveSession(j);
    ME = { name: r.name, username: user.toLowerCase(), is_admin: !!r.is_admin, need_pin: !!r.need_pin };
    try { const me = await rpc('hsm_me'); if (me) Object.assign(ME, meFields(me)); } catch (e) {}
    store.set('hsm_me', ME); pendingCreds = null;
    location.hash = 'home'; render();
    if (!ME.need_pin) toast(`Welcome, ${firstName(ME.name)}`);
  } catch (e) {
    if (btn) btn.disabled = false;
    err(/fetch|network/i.test(e.message) ? 'No network. Check connection.' : /banned/i.test(e.message) ? 'Your access is not approved yet.' : e.message);
  }
}
function mailApprover(c) {
  const nd = c.kind === 'new_device';
  const subject = `HSM E&A App – ${nd ? 'new phone' : 'access request'}: ${c.name}`;
  const body = `Hello ${ADMIN_NAME},\n\n${nd ? 'I am signing in to the HSM E&A app from a new phone. Please approve it.' : 'Please approve my access to the HSM E&A app.'}\n\nName: ${c.name}\nUsername: ${c.user}\nPhone: ${c.device || ''}\n\nTo approve: HSM E&A app → Home → Approvals.\n\nThank you.`;
  if (window.HSMNative && HSMNative.email) HSMNative.email(ADMIN_MAIL, subject, body);
  else location.href = `mailto:${ADMIN_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function viewSetPin(change) {
  $('#app').innerHTML = `<div class="login">
    <div class="top"><div class="mk">${ic('key', 30)}</div><h1>${change ? 'Change PIN' : 'Set your PIN'}</h1><p>${change ? 'Choose a new PIN.' : `Welcome ${esc(firstName(ME.name))}! Create a personal PIN. From now on you sign in with your username + this PIN – your SAP ID will no longer work.`}</p></div>
    <div class="sheet"><form class="f" id="pf" style="padding:0">
      <div id="perr"></div>
      <div class="fld"><label for="p1">New PIN (4–6 digits)</label><input id="p1" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" style="font-size:26px;letter-spacing:8px;text-align:center"></div>
      <div class="fld"><label for="p2">Repeat PIN</label><input id="p2" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" style="font-size:26px;letter-spacing:8px;text-align:center"></div>
      <button class="btn pri block" type="submit" id="psub">Save PIN</button>
      ${change ? '<button class="btn ghost block" type="button" data-back="profile">Cancel</button>' : ''}
      <p class="hint" style="line-height:1.45">Don't share your PIN. Everything you submit in the app is recorded under your name.</p></form></div></div>`;
  $('#pf').onsubmit = async e => {
    e.preventDefault(); const a = $('#p1').value.trim(), b = $('#p2').value.trim();
    const err = m => { $('#perr').innerHTML = `<div class="err">${esc(m)}</div>`; };
    if (!/^\d{4,6}$/.test(a)) return err('PIN must be 4 to 6 digits');
    if (a !== b) return err('The two PINs do not match');
    $('#psub').disabled = true;
    try { await rpc('hsm_set_pin', { p_pin: a }); ME.need_pin = false; store.set('hsm_me', ME); toast('PIN saved'); location.hash = 'home'; render(); }
    catch (x) { $('#psub').disabled = false; err(x.message); }
  };
}

/* ================= HOME ================= */
async function viewHome() {
  const now = new Date(); const sh = curShift(now);
  const cS = can('schedule'), cC = can('checklist'), cP = can('spares');
  const mods = MODULES.filter(m => can(m[0]));
  const canAp = !!ME.is_admin || isModAdmin('leave') || store.get('hsm_scap', false);
  if (!ME.is_admin && !isModAdmin('leave')) rpc('hsm_sc_is_approver').then(v => { v = v === true; if (v !== !!store.get('hsm_scap', false)) { store.set('hsm_scap', v); if (location.hash.replace('#', '') === '' || location.hash === '#home') viewHome(); } }).catch(() => {});
  $('#app').innerHTML = `<main class="scroll">
    <div class="hero"><div class="row"><div><div class="brand">HSM · Electrical &amp; Automation</div>
      <div class="hi">${greet()}, ${esc(firstName(ME.name))}</div>
      <div class="sub">${DAYNAME[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}</div></div>
      <button class="avatar-btn" data-go="profile" aria-label="My profile" style="overflow:hidden;padding:0">${ME.avatar ? `<img src="${esc(ME.avatar)}" alt="" style="width:100%;height:100%;object-fit:cover">` : esc(initials(ME.name))}</button></div></div>
    ${cS ? `<div class="lift card shiftcard" id="hshift"><div class="top"><div class="bigshift">${sh}</div><div><div class="t1">Shift on duty now</div><div class="t2">Shift ${sh} · ${SHIFT_TIME[sh]}</div></div></div>
      <div class="chips" id="hcrew"><span class="hint">Loading crew…</span></div></div>` : '<div style="height:16px"></div>'}
    <div id="hadmin"></div><div id="hleave"></div>
    <div class="card thought"><span class="k">Thought of the day</span><p>“${esc(QUOTES[Math.floor((Date.now() + 19800000) / 864e5) % QUOTES.length])}”</p></div>
    ${cC || cP ? `<div class="stats" style="${cC && cP ? '' : 'grid-template-columns:1fr'}">
      ${cC ? `<button class="card stat" data-go="checklist"><span class="k">Check lists today</span><span class="v" id="hcl">–</span><span class="bar2"><i id="hclb" style="width:0"></i></span></button>` : ''}
      ${cP ? `<button class="card stat" id="hlow"><span class="k">Spares out / low stock</span><span class="v" id="hsp">–</span><span class="hint" id="hspz">Tap to view</span></button>` : ''}
    </div>` : ''}
    <div class="sec-h">Apps</div>
    ${mods.length || canAp ? `<div class="grid">${canAp ? `<button class="card tile ap" data-go="approval"><span class="ic">${ic('key', 26)}<b class="bdg hidden" id="apb"></b></span><span><span class="tt">Approval</span></span><span class="ts" id="aps">Pending requests</span></button>` : ''}${mods.map(([k, t, i, sub]) => tile(k, i, t.replace(/'/g, '&#39;'), sub)).join('')}</div>`
      : `<div class="empty"><b>No modules yet</b>Ask ${esc(ADMIN_NAME)} to give you access.</div>`}
    <button class="aboutlink" data-go="about">${ic('info', 18)} About this app</button>
    <div style="height:24px"></div>
  </main>${nav('home')}`;
  if ($('#hlow')) $('#hlow').onclick = () => { S.spareLow = true; go('spares'); };
  setTimeout(homeAlerts, 50);
  const today = ymd(now);
  try {
    const soft = p => p.catch(e => { if (isNet(e)) return null; throw e; });
    let [roster, tpl, done, low] = await Promise.all([
      cS ? soft(api(`shift_roster?select=name,shift,area,ranking&day=eq.${today}&order=ranking,name`)) : null,
      cC ? templates() : [],
      cC ? soft(api(`checklist_entries?select=template_code&check_date=eq.${today}`)) : null,
      cP ? soft(api(`spares_v?select=ik,item_total&item_total=lt.${LOWN}&low_hidden=eq.false`).then(rs => { const m = {}; (rs || []).forEach(r => { m[r.ik] = { qty: r.item_total }; }); return Object.values(m); })) : null]);
    if (cS && $('#hcrew')) {
      roster = roster || [];
      const crew = roster.filter(r => r.shift === sh);
      const mine = roster.find(r => sameName(r.name, ME.name));
      $('#hcrew').innerHTML = (crew.length ? crew.map(r => `<span class="chip ${sameName(r.name, ME.name) ? 'me' : ''}">${esc(r.name)}</span>`).join('') : '<span class="hint">No roster uploaded for today</span>')
        + (mine && mine.shift !== sh ? `<span class="chip me">You today: ${esc(mine.shift === 'WO' ? 'Weekly off' : mine.shift === 'L' ? 'Leave' : mine.shift === 'G' ? 'General' : 'Shift ' + mine.shift)}</span>` : '');
    }
    if (cC && $('#hcl')) {
      done = [...(done || []), ...obxEntries(today)];
      const n = new Set(done.map(d => d.template_code)).size;
      $('#hcl').innerHTML = `${n}<small>/${tpl.length}</small>`; $('#hclb').style.width = (tpl.length ? 100 * n / tpl.length : 0) + '%';
    }
    if (cP && $('#hsp')) { $('#hsp').textContent = low ? low.length : '–'; const z = low ? low.filter(x => x.qty <= 0).length : 0; if ($('#hspz')) $('#hspz').textContent = low ? `${z} nil · ${low.length - z} below ${LOWN}` : 'Tap to view'; }
  } catch (e) { netErr(e); }
  if (canAp) {
    try { const c = await approvalCounts(); const b = $('#apb');
      if (b) { b.textContent = c.total > 99 ? '99+' : c.total; b.classList.toggle('hidden', !c.total); }
      if ($('#aps')) $('#aps').textContent = c.total ? `${c.total} waiting for you` : 'Nothing pending'; } catch (e) {}
  }
}
async function approvalCounts() {
  const c = { acc: 0, bad: 0, sug: 0, leave: 0, sc: 0, total: 0 }, jobs = [];
  if (ME.is_admin || store.get('hsm_scap', false) || isModAdmin('leave')) jobs.push(rpc('hsm_sc_list', { p_scope: 'approve' }).then(r => { c.sc = (r || []).length; }).catch(() => {}));
  if (ME.is_admin) {
    jobs.push(rpc('hsm_users').then(req => { c.acc = req.filter(r => r.status === 'pending' || (r.status === 'approved' && r.pending_device_name)).length; c.bad = req.reduce((n, r) => n + (r.fails_24h || 0), 0); }).catch(() => {}));
    jobs.push(api('suggestions?select=id&status=eq.new').then(r => { c.sug = (r || []).length; }).catch(() => {}));
  }
  if (isModAdmin('leave')) jobs.push(api('leave_requests?select=id&status=eq.pending').then(r => { c.leave = (r || []).length; }).catch(() => {}));
  await Promise.all(jobs); c.total = c.acc + c.sug + c.leave + c.sc; return c;
}
async function viewApprovalHub() {
  if (!(ME.is_admin || isModAdmin('leave') || store.get('hsm_scap', false))) return go('home');
  $('#app').innerHTML = `${bar('Approval', 'home', `<button class="ib" id="aprf" aria-label="Refresh">${ic('refresh', 26)}</button>`)}<main class="scroll" id="aph"><div class="spin">Loading…</div></main>${nav('')}`;
  $('#aprf').onclick = viewApprovalHub;
  const c = await approvalCounts();
  const row = (id, icon, t, sub, n) => `<button class="lrow aprow" data-ap="${id}"><span class="ic apic">${ic(icon, 24)}</span><span class="tx"><span class="a">${t}</span><span class="b">${sub}</span></span><span class="tag ${n ? 'red' : ''}">${n}</span><span class="chev">${ic('chev', 20)}</span></button>`;
  const rows = [];
  if (ME.is_admin) rows.push(row('acc', 'users', 'New users &amp; phone changes', c.acc ? `${c.acc} waiting for approval${c.bad ? ` · ${c.bad} wrong login${c.bad > 1 ? 's' : ''} today` : ''}` : `Nothing pending${c.bad ? ` · ${c.bad} wrong login${c.bad > 1 ? 's' : ''} today` : ''}`, c.acc));
  if (isModAdmin('leave')) rows.push(row('leave', 'plane', 'Leave requests', c.leave ? `${c.leave} waiting for your decision` : 'Nothing pending', c.leave));
  if (ME.is_admin || store.get('hsm_scap', false) || isModAdmin('leave')) rows.push(row('sc', 'cal', 'Shift change requests', c.sc ? `${c.sc} waiting for your decision` : 'Nothing pending', c.sc));
  if (ME.is_admin) rows.push(row('sug', 'bulb', 'Suggestions from the team', c.sug ? `${c.sug} new` : 'No new suggestions', c.sug));
  $('#aph').innerHTML = `<div class="pad"><div class="label">${c.total ? `${c.total} item${c.total > 1 ? 's' : ''} waiting` : 'All clear – nothing pending'}</div><div class="list">${rows.join('')}</div></div>`;
  $('#aph').onclick = e => { const b = e.target.closest('[data-ap]'); if (!b) return; const k = b.dataset.ap;
    if (k === 'acc') { S.reqTab = 'pending'; go('approvals'); } else if (k === 'leave') { S.leaveTab = 'approve'; go('leave'); } else if (k === 'sc') { S.leaveTab = 'shift'; go('leave'); } else { S.sugTab = 'inbox'; go('suggest'); } };
}
async function homeAlerts() {
  const box = $('#hleave'); if (!box) return; let html = '';
  if (isModAdmin('leave')) { /* pending leave requests are inside the Approval module */ }
  else if (can('leave')) { try { const mineR = await api(`leave_requests?select=id,status,decided_at&auth_id=eq.${uidOfToken()}&status=in.(approved,rejected)&decided_at=gte.${new Date(Date.now() - 3 * 864e5).toISOString()}`);
    const seen = store.get('hsm_leave_seen', 0), fresh = mineR.filter(r => new Date(r.decided_at).getTime() > seen);
    if (fresh.length) html += `<button class="alert" data-go="leave" style="margin-top:10px;background:#E8F1FB;color:#14529C">${ic('plane')}<span style="flex:1">Your leave request was ${fresh.some(r => r.status === 'rejected') ? 'decided' : 'approved'} – tap to see</span>${ic('chev')}</button>`; } catch (e) {} }
  if (can('checklist')) { try { const d = await abnormalFor(ymd(new Date())); if (d.items.length) html += `<button class="alert" data-go="actions" style="margin-top:10px">${ic('warn')}<span style="flex:1">${d.items.length} abnormal reading${d.items.length > 1 ? 's' : ''} today – action required</span>${ic('chev')}</button>`; } catch (e) {} }
  box.innerHTML = html;
}
// keep the selected tab visible inside a sliding tab bar
function centerOn(sel) { const f = () => { const on = $(sel); if (!on || !on.parentElement) return; const c = on.parentElement; c.scrollLeft = on.offsetLeft - (c.clientWidth - on.offsetWidth) / 2; }; requestAnimationFrame(f); setTimeout(f, 250); }
const tile = (to, icon, t, s) => `<button class="card tile" data-go="${to}"><span class="ic">${ic(icon, 26)}</span><span><span class="tt">${t}</span></span><span class="ts">${s}</span></button>`;

/* ================= PROFILE ================= */
// full-screen photo (tap to close)
function showPhoto(url, name) {
  if (!url) return;
  const m = $('#modal');
  m.innerHTML = `<div class="photov" role="img" aria-label="${esc(name || 'Photo')}"><img src="${esc(url)}" alt=""><div class="cap">${esc(name || '')}</div><button class="ib" aria-label="Close">${ic('x', 30)}</button></div>`;
  m.classList.remove('hidden'); m.onclick = () => { m.classList.add('hidden'); m.onclick = null; };
}
const ADMIN_UPLOAD_MODS = ['schedule', 'team', 'contacts', 'tbt', 'mill'];
function viewProfile() {
  const upl = ME.is_admin || ADMIN_UPLOAD_MODS.some(isModAdmin);
  $('#app').innerHTML = `${bar('My Profile', 'home')}<main class="scroll"><div class="pad">
    <div class="card" style="padding:22px;display:flex;align-items:center;gap:16px">
      <button class="phbtn" id="pview" aria-label="${ME.avatar ? 'View my photo' : 'Add a photo'}">${avHtml(ME.avatar, ME.name, 'width:84px;height:84px;border-radius:42px;font-size:28px')}</button>
      <div style="min-width:0"><div style="font-size:21px;font-weight:700">${esc(ME.name)}</div><div class="hint">${esc(ME.username)}${ME.role ? ' · ' + esc(ME.role) : ''}</div>
      ${ME.is_admin ? '<span class="tag soft" style="margin-top:6px">App admin</span>' : (ME.admin_modules || []).length ? `<span class="tag soft" style="margin-top:6px">Admin: ${esc(MODULES.filter(m => ME.admin_modules.includes(m[0])).map(m => m[1].replace(/&#39;|'/g, '’')).join(', '))}</span>` : ''}
      <div class="phact"><label class="linkbtn">${ic('camera', 18)} ${ME.avatar ? 'Change photo' : 'Add photo'}<input type="file" id="pph" accept="image/*" hidden></label>
        ${ME.avatar ? `<button class="linkbtn" id="prm">${ic('x', 18)} Remove</button>` : ''}</div></div></div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:18px">
      <button class="btn block" data-go="pin">${ic('key')} Change PIN</button>
      ${ME.is_admin ? `<button class="btn block" data-go="approvals">${ic('users')} App approvals &amp; sign-ins</button>` : ''}
      ${ME.is_admin || (ME.admin_modules || []).length ? `<button class="btn block" data-go="activity">${ic('list')} Activity log (who changed what)</button>` : ''}
      ${ME.is_admin ? `<button class="btn block" data-go="clearlogs">${ic('x')} Clear logs (admin only)</button>` : ''}
      ${upl ? `<button class="btn block" data-go="admin">${ic('upload')} Admin uploads</button>` : ''}
      ${ME.is_admin ? `<button class="btn block" data-go="suggest">${ic('bulb')} Suggestions from the team</button>
        <button class="btn block" id="pxl">${ic('xls')} Master spares Excel (cloud)</button>` : ''}
      <button class="btn block" data-go="about">${ic('info')} About this app</button>
      <button class="btn ghost block" id="pout">${ic('logout')} Sign out</button></div>
    <p class="hint" style="margin-top:22px;text-align:center">HSM E&amp;A App · version ${APP_VERSION} (build ${esc(window.HSM_APP_VERSION || 0)})</p></div></main>`;
  $('#pview').onclick = () => ME.avatar ? showPhoto(ME.avatar, ME.name) : $('#pph').click();
  $('#pph').onchange = async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    if (f.size > 25 * 1024 * 1024) return toast('Photo is too large');
    try { await setMyPhoto(f); viewProfile(); } catch (err) { netErr(err); } };
  if ($('#prm')) $('#prm').onclick = async () => { if (!(await ask('Remove your photo?', '', 'Remove'))) return;
    try { await rpc('hsm_set_avatar', { p_url: null }); ME.avatar = null; store.set('hsm_me', ME); AVATARS = null; viewProfile(); } catch (err) { netErr(err); } };
  if ($('#pxl')) $('#pxl').onclick = async () => {
    try { const link = await rpc('hsm_excel_link'); if (!link) return toast('Not allowed');
      const m = $('#modal');
      m.innerHTML = `<div class="sheet"><h3>Master spares Excel</h3><p>This private link always downloads the latest spares from the cloud – your PC does not need to be on. Keep it private.</p>
        <div class="err" style="background:var(--bg);color:var(--ink);font-size:13px;word-break:break-all;user-select:all">${esc(link)}</div>
        <button class="btn pri block" id="xo">${ic('download')} Download now</button><div class="two"><button class="btn" id="xc">Copy link</button><button class="btn ghost" id="xx">Close</button></div></div>`;
      m.classList.remove('hidden');
      $('#xo').onclick = () => openLink(link);
      $('#xc').onclick = async () => { try { await navigator.clipboard.writeText(link); toast('Link copied'); } catch (e) { toast('Long-press the link to copy'); } };
      $('#xx').onclick = () => m.classList.add('hidden');
    } catch (e) { netErr(e); }
  };
  $('#pout').onclick = async () => { if (await ask('Sign out?', 'You will need your username and PIN to sign in again.', 'Sign out')) logout(); };
}

/* ================= APPROVALS & SIGN-INS (admin) ================= */
let REQ = [];
const RESULT = { ok: ['Signed in', 'green'], first_login: ['First sign-in', 'green'], new_device: ['New phone tried', 'amber'], wrong_password: ['Wrong SAP ID / PIN', 'red'],
  locked: ['Locked (too many tries)', 'red'], not_approved: ['Not approved yet', 'amber'], unknown_user: ['Unknown username', 'red'] };
// Access editor: module ticks, area ticks inside Check List / Mill SOPs, and "Admin" per module
const ACC_MODS = [...MODULES, ['planning', 'Planning – Out of stock status', 'box'], ['clset', 'Checklist settings (alert limits)', 'gear']];
const accessEditor = (r, key, withAdmin = true) => `<div class="acc" data-ak="${key}">${ACC_MODS.map(([k, t, i]) => {
  const on = (r.modules || ALL_MODS).includes(k), adm = (r.admin_modules || []).includes(k);
  const areas = k === 'planning' ? SPARE_AREAS.map(a => [a, a]) : AREA_MODS[k], sel = r.areas && Array.isArray(r.areas[k]) ? r.areas[k] : null;
  return `<div class="accm ${on ? 'on' : ''}" data-m="${k}"><div class="accr"><label class="modchk"><input type="checkbox" class="am" value="${k}" ${on ? 'checked' : ''}><span class="mi">${ic(i, 18)}</span><span>${t}</span></label>
    ${withAdmin ? `<label class="admchk"><input type="checkbox" class="ad" ${adm ? 'checked' : ''}><span>${k === 'planning' ? 'All areas' : 'Admin'}</span></label>` : ''}</div>${k === 'planning' ? '<div class="hint" style="padding:0 4px 6px">Can write Planning status in Spares → Out / low stock. Tick “All areas” or pick areas below.</div>' : ''}
    ${areas ? `<div class="areas"><span class="hint">Areas</span>${areas.map(([a, l]) => `<label class="chipchk"><input type="checkbox" class="aa" value="${a}" ${!sel || sel.includes(a) ? 'checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div>` : ''}</div>`; }).join('')}
  ${withAdmin ? `<div class="accinc"><div class="accr"><span class="mi">${ic('users', 18)}</span><b style="flex:1">Area incharge of</b></div><div class="hint" style="padding:0 4px 6px">Gets the Planning updates of these areas as notifications and can write Planning status for them.</div><div class="areas">${SPARE_AREAS.map(a => `<label class="chipchk"><input type="checkbox" class="inch" value="${esc(a)}" ${r.areas && Array.isArray(r.areas.incharge) && r.areas.incharge.includes(a) ? 'checked' : ''}><span>${esc(a)}</span></label>`).join('')}</div></div>` : ''}</div>`;
function wireAccess(key) {
  const box = $(`[data-ak="${key}"]`); if (!box) return;
  box.addEventListener('change', e => { const m = e.target.closest('.accm'); if (!m) return;
    if (e.target.classList.contains('ad') && e.target.checked) $('.am', m).checked = true;
    if (e.target.classList.contains('am') && !e.target.checked) { const ad = $('.ad', m); if (ad) ad.checked = false; }
    m.classList.toggle('on', $('.am', m).checked); });
}
function readAccess(key) {
  const box = $(`[data-ak="${key}"]`), out = { modules: [], admin_modules: [], areas: {} };
  $$('.accm', box).forEach(m => { const k = m.dataset.m, on = $('.am', m).checked, ad = $('.ad', m);
    if (on) out.modules.push(k); if (ad && ad.checked) out.admin_modules.push(k);
    const aa = $$('.aa', m); if (on && aa.length && !(k === 'planning' && ad && ad.checked)) { const sel = aa.filter(x => x.checked).map(x => x.value); if (sel.length < aa.length) out.areas[k] = sel; } });
  { const ic2 = $$('.inch', box).filter(c => c.checked).map(c => c.value); if (ic2.length) out.areas.incharge = ic2; }
  return out;
}
async function viewApprovals() {
  if (!ME.is_admin) return go('home');
  $('#app').innerHTML = `${bar('Approvals & Sign-ins', 'home', `<button class="ib" id="arf" aria-label="Refresh">${ic('refresh', 26)}</button>`)}
    <div class="seg" id="aseg">${[['pending','Pending'],['users','Users'],['approvers','Approvers'],['log','Sign-ins'],['other','Others']].map(([k, l]) => `<button data-t="${k}" class="${S.reqTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <main class="scroll" id="al"><div class="spin">Loading…</div></main>`;
  $('#arf').onclick = viewApprovals;
  centerOn('#aseg .on');
  { const on = $('#aseg .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }
  $('#aseg').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { S.reqTab = b.dataset.t; viewApprovals(); } };
  try { REQ = await rpc('hsm_users'); } catch (e) { netErr(e); $('#al').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  const isPend = r => r.status === 'pending' || (r.status === 'approved' && r.pending_device_name);
  const groups = { pending: REQ.filter(isPend), users: REQ.filter(r => r.status === 'approved'), other: REQ.filter(r => !['pending','approved'].includes(r.status)) };
  $$('#aseg button').forEach(b => { if (groups[b.dataset.t]) b.textContent = `${b.textContent.replace(/ \(\d+\)$/, '')} (${groups[b.dataset.t].length})`; });
  if (S.reqTab === 'log') return drawLog($('#al'), null);
  if (S.reqTab === 'approvers') return drawApproverSetup($('#al'));
  const list = groups[S.reqTab] || [];
  const body = S.reqTab === 'pending' ? list.map(r => {
      const phone = r.status === 'approved';
      return `<div class="lrow" style="flex-wrap:wrap">${avHtml(r.avatar_url, r.full_name)}
        <span class="tx"><span class="a">${esc(r.full_name)}</span><span class="b">${esc(r.username || '')} · ${esc(r.company_role || '')}</span>
        <span class="b">${phone ? `<b style="color:var(--amber)">New phone:</b> ${esc(r.pending_device_name)}<br>Current: ${esc(r.device_name || '-')}` : `Phone: ${esc(r.pending_device_name || '-')}`}</span>
        <span class="b">${fmtStamp(r.pending_since || r.requested_at)}</span></span>
        <span class="tag ${phone ? 'amber' : 'soft'}">${phone ? 'Phone change' : 'New user'}</span>
        ${phone ? '' : `<div style="width:100%;margin-top:10px"><div class="label" style="margin:0 0 6px">What this person can open</div>${accessEditor(r, 'p' + r.id)}</div>`}
        <div class="two" style="width:100%;margin-top:8px"><button class="btn ghost" data-d="${r.id}" data-a="0">${ic('x')} Reject</button><button class="btn green" data-d="${r.id}" data-a="1">${ic('ok')} Approve</button></div></div>`; }).join('')
    : list.map(r => `<button class="lrow" data-go="user/${r.id}">${avHtml(r.avatar_url, r.full_name)}
        <span class="tx"><span class="a">${esc(r.full_name)}</span><span class="b">${esc(r.username || 'No username / SAP ID in list')}${r.device_name ? ' · ' + esc(r.device_name) : ''}</span>
        <span class="b">${r.last_login ? 'Last sign-in ' + fmtStamp(r.last_login) : r.status === 'approved' ? 'Not signed in yet' : esc(r.company_role || '')}${r.status === 'approved' && !r.has_pin ? ' · no PIN yet' : ''}${r.status === 'approved' ? ' · ' + (r.is_admin ? 'all modules (admin)' : `${(r.modules || []).filter(x => ALL_MODS.includes(x)).length} of ${MODULES.length} modules`) : ''}</span></span>
        ${r.fails_24h ? `<span class="tag red">${r.fails_24h} wrong</span>` : r.status === 'rejected' ? '<span class="tag red">Rejected</span>' : r.status === 'none' ? '<span class="tag">Not requested</span>' : ''}<span class="chev">${ic('chev', 20)}</span></button>`).join('');
  $('#al').innerHTML = list.length ? `<div class="pad">${S.reqTab === 'users' ? '<div class="label">Tap a person to see their sign-ins and phone</div>' : ''}<div class="list">${body}</div></div>`
    : `<div class="empty"><b>${S.reqTab === 'pending' ? 'Nothing waiting' : 'Nobody here'}</b>${S.reqTab === 'pending' ? 'New users and phone changes appear here.' : ''}</div>`;
  list.filter(isPend).forEach(r => wireAccess('p' + r.id));
  if (['users', 'other'].includes(S.reqTab)) { $('#al').insertAdjacentHTML('afterbegin', `<div style="padding:12px 16px 0"><button class="btn pri block" id="uadd">${ic('plus', 20)} Add user</button></div>`); $('#uadd').onclick = addUserSheet; }
  $('#al').onclick = async e => {
    const b = e.target.closest('[data-d]'); if (!b) return;
    const r = REQ.find(x => String(x.id) === b.dataset.d); const ok = b.dataset.a === '1'; const phone = r.status === 'approved';
    if (!ok && !(await ask(phone ? `Block the new phone for ${r.full_name}?` : `Reject ${r.full_name}?`, phone ? 'They stay signed in on their current phone only.' : 'They will not be able to open the app.', 'Reject'))) return;
    if (ok && phone && !(await ask(`Move ${r.full_name} to the new phone?`, `${r.pending_device_name}\nThe old phone (${r.device_name || '-'}) will be signed out.`, 'Approve'))) return;
    let acc = null;
    if (ok && !phone) { acc = readAccess('p' + r.id); if (!acc.modules.length) return toast('Tick at least one module'); }
    b.disabled = true;
    try { if (acc) await rpc('hsm_set_access', { p_id: r.id, p_modules: acc.modules, p_areas: acc.areas, p_admin_modules: acc.admin_modules });
      const res = await rpc('hsm_decide', { p_id: r.id, p_approve: ok }); logAct('admin', ok ? 'User approved' : 'User rejected', r.full_name); toast({ approved: `${r.full_name} approved`, rejected: `${r.full_name} rejected`, device_changed: 'New phone approved', device_rejected: 'New phone blocked' }[res] || 'Done'); viewApprovals(); }
    catch (err) { netErr(err); b.disabled = false; }
  };
}
function addUserSheet() {
  const m = $('#modal'), appr = REQ.filter(r => r.is_admin || (r.admin_modules || []).includes('leave'));
  const areas = ['Crane', 'DC', 'Drive', 'FM', 'Instrument', 'L1', 'Motor', 'Planning', 'Power', 'RM', 'Shift'];
  m.innerHTML = `<div class="sheet" style="max-height:92vh;overflow:auto"><h3>Add user</h3><p class="hint" style="margin:0 0 8px">The person signs in with the username, and the SAP ID is the first password. You approve them once on their first sign-in.</p>
    <form class="f" id="auf" style="padding:0">
    <div class="fld"><label for="au-n">Full name</label><input id="au-n" autocomplete="off"></div>
    <div class="two"><div class="fld"><label for="au-u">Username</label><input id="au-u" autocapitalize="none" autocomplete="off" placeholder="e.g. rkanjariya"></div>
      <div class="fld"><label for="au-s">SAP ID</label><input id="au-s" inputmode="numeric" autocomplete="off"></div></div>
    <div class="two"><div class="fld"><label for="au-r">Role / company</label><input id="au-r" placeholder="AMNS Employee"></div>
      <div class="fld"><label for="au-a">Team list area</label><input id="au-a" list="au-al" placeholder="Leave empty = not in Team list"><datalist id="au-al">${areas.map(a => `<option value="${a}">`).join('')}</datalist></div></div>
    <div class="fld"><label for="au-l">Leave approver</label><select id="au-l"><option value="">Any approver / admin</option>${appr.map(r => `<option value="${r.id}">${esc(r.full_name)}</option>`).join('')}</select></div>
    <div class="label" style="margin:6px 0 4px">What this person can open</div>
    ${accessEditor({ modules: ['contacts', 'leave', 'schedule', 'sop', 'spares', 'tbt', 'team'], admin_modules: [], areas: {} }, 'nu')}
    <div class="two" style="margin-top:12px"><button type="button" class="btn ghost" id="au-x">Cancel</button><button type="submit" class="btn pri">Add user</button></div></form></div>`;
  m.classList.remove('hidden'); m.onclick = e => { if (e.target === m) m.classList.add('hidden'); };
  wireAccess('nu');
  $('#au-x').onclick = () => m.classList.add('hidden');
  $('#auf').onsubmit = async e => { e.preventDefault();
    const acc = readAccess('nu'), n = $('#au-n').value.trim(), u = $('#au-u').value.trim(), s = $('#au-s').value.trim();
    if (!n || !u || !s) return toast('Enter name, username and SAP ID');
    try { await rpc('hsm_add_user', { p_name: n, p_username: u, p_sap: s, p_role: $('#au-r').value, p_modules: acc.modules, p_areas: acc.areas, p_admin_modules: acc.admin_modules, p_leave_approver: $('#au-l').value ? +$('#au-l').value : null, p_team_area: $('#au-a').value });
      m.classList.add('hidden'); toast(`${n} added`); S.reqTab = 'other'; viewApprovals(); } catch (err) { netErr(err); } };
}
async function drawLog(el, userId) {
  el.innerHTML = '<div class="spin">Loading…</div>';
  let rows = [];
  try { rows = await rpc('hsm_login_log', { p_user_id: userId, p_limit: userId ? 60 : 150 }) || []; } catch (e) { netErr(e); }
  const warn = rows.filter(r => ['wrong_password','locked','new_device','unknown_user'].includes(r.result) && Date.now() - new Date(r.at) < 7 * 864e5).length;
  el.innerHTML = `<div class="pad">${!userId && warn ? `<div class="alert" style="width:100%;margin:0 0 12px">${ic('warn')}<span>${warn} suspicious sign-in attempt${warn > 1 ? 's' : ''} in the last 7 days</span></div>` : ''}
    <div class="label">${userId ? 'Sign-in history' : 'Latest sign-ins (all users)'}</div>` + (rows.length ? `<div class="list">${rows.map(r => { const [t, c] = RESULT[r.result] || [r.result, ''];
      return `<div class="lrow"${r.user_id && !userId ? ` data-go="user/${r.user_id}" style="cursor:pointer"` : ''}><span class="tx">${userId ? '' : `<span class="a" style="font-size:16px">${esc(r.full_name || r.typed_user || '?')}</span>`}
        <span class="b">${fmtStamp(r.at)} · ${esc(r.device_name || 'unknown device')}</span></span><span class="tag ${c}">${esc(t)}</span></div>`; }).join('')}</div>`
      : '<div class="empty"><b>No sign-ins yet</b></div>') + '</div>';
}
async function viewUser(id) {
  if (!ME.is_admin) return go('home');
  $('#app').innerHTML = `${bar('User', 'approvals')}<main class="scroll" id="ud"><div class="spin">Loading…</div></main>`;
  if (!REQ.length) { try { REQ = await rpc('hsm_users'); } catch (e) { netErr(e); return; } }
  const r = REQ.find(x => String(x.id) === String(id)); if (!r) { $('#ud').innerHTML = '<div class="empty"><b>User not found</b></div>'; return; }
  const self = sameName(r.full_name, ME.name) && r.username === ME.username;
  $('#ud').innerHTML = `<div class="dayhead"><div class="k">${esc(r.company_role || '')} · ${esc(r.status)}</div><div class="v">${esc(r.full_name)}</div><div style="font-size:15px">${esc(r.username || '')}</div></div>
    <div class="meta"><div><span class="k">Username</span><span class="v">${esc(r.login_name || '-')}</span></div><div><span class="k">SAP ID</span><span class="v">${esc(r.sap_id || '-')}</span></div>
      <div><span class="k">Registered phone</span><span class="v">${esc(r.device_name || 'None yet')}</span></div><div><span class="k">PIN</span><span class="v">${r.has_pin ? 'Set' : 'Not set'}</span></div>
      <div><span class="k">Last sign-in</span><span class="v">${r.last_login ? fmtStamp(r.last_login) : '-'}</span></div><div><span class="k">Approved by</span><span class="v">${esc(r.decided_by || '-')}${r.decided_at ? ' · ' + fmtShort(new Date(r.decided_at)) : ''}</span></div></div>
    ${r.status === 'approved' && !self ? `<div style="padding:14px 16px 0;display:flex;flex-direction:column;gap:10px">
      ${r.has_pin ? `<button class="btn block" data-x="reset_pin">${ic('key')} Reset PIN (forgot PIN)</button>` : ''}
      ${r.device_name ? `<button class="btn block" data-x="unbind">${ic('refresh')} Free the phone</button>` : ''}
      <button class="btn ghost block" data-x="remove" style="color:var(--red);border-color:var(--red-100)">${ic('x')} Remove access</button></div>`
      : r.status !== 'approved' && r.status !== 'pending' ? `<div style="padding:14px 16px 0"><button class="btn green block" data-x="approve">${ic('ok')} Approve now</button></div>` : ''}
    <div style="padding:10px 16px 0"><button class="btn block" data-x="edit">${ic('edit')} Edit name, username, SAP ID</button></div>
    ${r.is_admin ? '' : `<div class="pad" style="padding-bottom:0"><div class="card" style="padding:14px 14px 16px"><div class="label" style="margin:0 0 4px">Access</div>
      <p class="hint" style="margin:0 0 10px">Tick the modules they can open. For Check List and SOP's of Mill Process, untick the areas they must not see. <b>Admin</b> lets them upload / edit in that module. The cloud enforces all of this.</p>
      ${accessEditor(r, 'u' + r.id)}<button class="btn pri block" id="usave" style="margin-top:12px">${ic('ok')} Save access</button></div></div>`}
    <div id="ulog"></div>`;
  drawLog($('#ulog'), r.id);
  wireAccess('u' + r.id);
  if ($('#usave')) $('#usave').onclick = async () => {
    const acc = readAccess('u' + r.id);
    if (!acc.modules.length && !(await ask(`No modules for ${r.full_name}?`, 'They can still sign in but will see no modules.', 'Save'))) return;
    try { const res = await rpc('hsm_set_access', { p_id: r.id, p_modules: acc.modules, p_areas: acc.areas, p_admin_modules: acc.admin_modules });
      Object.assign(r, res); toast('Access saved'); } catch (e) { netErr(e); }
  };
  $('#ud').onclick = async e => {
    const b = e.target.closest('[data-x]'); if (!b) return; const x = b.dataset.x;
    if (x === 'edit') return editUser(r, () => { REQ = []; viewUser(id); });
    const txt = { reset_pin: [`Reset PIN for ${r.full_name}?`, 'They can sign in once with their SAP ID (only on their registered phone) and must set a new PIN.', 'Reset'],
      unbind: [`Free the phone for ${r.full_name}?`, 'They are signed out now; the next phone they sign in on becomes their phone without asking you. Use this only if you know they changed phone.', 'Free phone'],
      remove: [`Remove access for ${r.full_name}?`, 'They are signed out immediately and cannot open the app.', 'Remove'],
      approve: [`Approve ${r.full_name}?`, 'Their phone is registered on their first sign-in.', 'Approve'] }[x];
    if (!(await ask(...txt))) return;
    try {
      logAct('admin', 'User action: ' + x, r.full_name);
      if (x === 'remove') await rpc('hsm_decide', { p_id: r.id, p_approve: false });
      else if (x === 'approve') await rpc('hsm_decide', { p_id: r.id, p_approve: true });
      else await rpc('hsm_admin_action', { p_id: r.id, p_action: x });
      toast('Done'); REQ = []; viewUser(id);
    } catch (err) { netErr(err); }
  };
}

function editUser(r, done) {
  const m = $('#modal');
  m.innerHTML = `<div class="sheet"><h3>Edit details</h3><form class="f" id="euf" style="padding:0">
    <div class="fld"><label for="eu-n">Full name</label><input id="eu-n" value="${esc(r.full_name)}"></div>
    <div class="two"><div class="fld"><label for="eu-u">Username</label><input id="eu-u" autocapitalize="none" value="${esc(r.login_name || '')}"></div>
      <div class="fld"><label for="eu-s">SAP ID</label><input id="eu-s" value="${esc(r.sap_id || '')}"></div></div>
    <div class="two"><div class="fld"><label for="eu-r">Role / company</label><input id="eu-r" value="${esc(r.company_role || '')}"></div>
      <div class="fld"><label for="eu-e">E-mail</label><input id="eu-e" type="email" value="${esc(r.office_email || '')}"></div></div>
    <p class="hint" style="margin:0">They sign in with the username (or the SAP ID). Before their PIN is set, the first password is the SAP ID.</p>
    <div class="two"><button type="button" class="btn ghost" id="eu-x">Cancel</button><button type="submit" class="btn pri">Save</button></div></form></div>`;
  m.classList.remove('hidden'); m.onclick = e => { if (e.target === m) m.classList.add('hidden'); };
  $('#eu-x').onclick = () => m.classList.add('hidden');
  $('#euf').onsubmit = async e => { e.preventDefault();
    try { await rpc('hsm_edit_user', { p_id: r.id, p_full_name: $('#eu-n').value, p_username: $('#eu-u').value, p_sap_id: $('#eu-s').value, p_role: $('#eu-r').value, p_email: $('#eu-e').value });
      m.classList.add('hidden'); toast('Details saved'); done(); } catch (err) { netErr(err); } };
}

/* ================= SHIFT SCHEDULE ================= */
async function contactSheet(name) {
  let people = []; try { people = await team(); } catch (e) {}
  const p = people.find(x => sameName(x.name, name)), mob = p && p.mobile ? String(p.mobile).replace(/[^0-9+]/g, '') : '', em = p && p.email ? String(p.email).trim() : '', md = $('#modal');
  md.innerHTML = `<div class="sheet"><h3>${esc(name)}</h3><p>${p ? esc([p.area, p.role || p.company].filter(Boolean).join(' · ')) : ''}</p>
    ${mob || em ? `<div class="two">${mob ? `<a class="btn pri" href="tel:${mob}">${ic('phone', 20)} Call</a>` : '<span></span>'}${em ? `<a class="btn" href="mailto:${esc(em)}">${ic('mail', 20)} Mail</a>` : '<span></span>'}</div>
      <p class="hint" style="text-align:center;margin:8px 0 0">${esc([mob ? p.mobile : '', em].filter(Boolean).join(' · '))}</p>` : '<p class="hint" style="margin:6px 0 10px">No phone or email saved for this person in Team.</p>'}
    <button class="btn ghost block" id="cx" style="margin-top:12px">Close</button></div>`;
  md.classList.remove('hidden'); md.onclick = e => { if (e.target === md) md.classList.add('hidden'); }; $('#cx').onclick = () => md.classList.add('hidden');
}
async function viewSchedule() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (!S.calMonth) S.calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  if (!S.calSel) S.calSel = new Date(today);
  $('#app').innerHTML = `${bar('Shift Schedule', 'home', logBtn('schedule'))}<main class="scroll" id="sc"><div class="spin">Loading…</div></main>${nav('schedule')}`;
  const m = S.calMonth, y = m.getFullYear(), mo = m.getMonth();
  let marked = new Set(), rows = [], extraH = [];
  try {
    const [daysR, dayR, hR] = await Promise.all([
      api(`shift_roster?select=day&day=gte.${ymd(m)}&day=lte.${ymd(new Date(y, mo + 1, 0))}`),
      api(`shift_roster?select=name,shift,area,ranking,sap_id,edited_by&day=eq.${ymd(S.calSel)}&order=ranking,name`),
      api(`holidays?select=day,name,kind&day=gte.${ymd(m)}&day=lte.${ymd(new Date(y, mo + 1, 0))}`).catch(() => [])]);
    daysR.forEach(r => marked.add(r.day)); rows = dayR; extraH = hR || [];
  } catch (e) { netErr(e); }
  const hmap = {};
  HOLIDAYS.forEach(([d, n, k]) => { (hmap[d] = hmap[d] || []).push({ name: n, kind: k }); });
  extraH.forEach(h => { (hmap[h.day] = hmap[h.day] || []).push({ name: h.name, kind: h.kind || 'plant', custom: true }); });
  const hKey = d => ymd(d);
  const monthH = Object.keys(hmap).filter(k => k >= ymd(m) && k <= ymd(new Date(y, mo + 1, 0))).sort();
  const hCls = list => !list ? '' : list.some(h => h.kind !== 'r') ? 'hol' : 'hol soft';
  const lead = (new Date(y, mo, 1).getDay() + 6) % 7, nDays = new Date(y, mo + 1, 0).getDate();
  let cells = ''; for (let i = 0; i < lead; i++) cells += '<span></span>';
  for (let d = 1; d <= nDays; d++) {
    const dt = new Date(y, mo, d), k = ymd(dt);
    const cls = [dt.getDay() === 0 ? 'sun' : '', +dt === +today ? 'today' : '', +dt === +S.calSel && +dt !== +today ? 'sel' : '', marked.has(k) ? 'has' : '', hCls(hmap[k])].join(' ');
    cells += `<button class="${cls}" data-day="${k}" aria-label="${d} ${MONTHS[mo]}${hmap[k] ? ', ' + hmap[k].map(h => h.name).join(', ') : ''}">${d}</button>`;
  }
  const incN = a => { a = String(a || '').trim().toLowerCase(); return a === 'automation (l1)' ? 'l1' : (a === 'abb mv drive' || a === 'abb lv drive') ? 'drive' : a; };
  const incAreas = !isModAdmin('schedule') && ME.areas && Array.isArray(ME.areas.incharge) ? ME.areas.incharge.map(incN) : [];
  const canEdP = r => isModAdmin('schedule') || incAreas.includes(incN(r.area));
  const editable = (isModAdmin('schedule') || incAreas.length) && +S.calSel >= +today, edit = editable && S.schedEdit;
  const by = s => rows.filter(r => r.shift === s);
  const nm = r => `<div class="nm ${sameName(r.name, ME.name) ? 'me' : ''}${edit && canEdP(r) ? ' ed' : ''}" data-nm="${esc(r.name)}" ${edit && canEdP(r) ? `data-p="${esc(r.name)}" role="button" tabindex="0"` : ''}>${esc(r.name)}${r.area ? ` <span class="hint">· ${esc(r.area)}</span>` : ''}${r.edited_by ? ` <span class="edmark" title="Changed in the app by ${esc(r.edited_by)}">${ic('edit', 13)} ${esc(firstName(r.edited_by))}</span>` : ''}${edit ? `<span class="chev">${ic('chev', 18)}</span>` : ''}</div>`;
  // General shift people are shown area-wise below, so the shift list shows A, B, C, Leave and Weekly Off
  const grp = (b, cls, t, list) => list.length ? `<div class="grp g-${cls}"><span class="badge ${cls}">${b}</span><div style="flex:1;min-width:0"><div class="gt">${t}</div>${list.map(nm).join('')}</div></div>` : '';
  const general = by('G'), areaMap = {};
  general.forEach(r => (areaMap[r.area || 'Other'] = areaMap[r.area || 'Other'] || []).push(r));
  const isToday = +S.calSel === +today;
  $('#sc').innerHTML = `<div class="pad">
    <button class="calpick ${S.calOpen ? 'open' : ''}" id="calt" aria-expanded="${!!S.calOpen}">${ic('cal', 22)}<span>${fmtDay(S.calSel)}</span><span class="cv">${ic('chev', 20)}</span></button>
    <section class="card ${S.calOpen ? '' : 'hidden'}" id="calbox" style="padding:8px 12px 14px;margin-bottom:14px">
      <div class="cal-h"><button class="ib" id="pm" aria-label="Previous month">${ic('back')}</button><h2>${MONTHS[mo]} ${y}</h2><button class="ib" id="nm" aria-label="Next month">${ic('chev')}</button></div>
      <div class="wk"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      <div class="days">${cells}</div>
    </section>
    <section class="card" style="overflow:hidden;margin-bottom:14px">
      <div class="dayhead" style="display:flex;flex-wrap:wrap;align-items:center;gap:10px"><div style="flex:1 1 100%"><div class="k">${isToday ? 'Shift Schedule Today' : 'Shift Schedule'}</div><div class="v">${fmtDay(S.calSel)}</div></div>
        <div style="display:flex;gap:8px;margin-left:auto">${isModAdmin('schedule') ? `<button class="btn sm" id="shol" aria-label="Add holiday">${ic('star', 18)} Holiday</button>` : ''}
        ${editable ? `<button class="btn sm ${edit ? 'pri' : ''}" id="sedit">${ic(edit ? 'ok' : 'edit', 18)} ${edit ? 'Done' : 'Edit'}</button>` : ''}</div></div>
      ${hmap[ymd(S.calSel)] ? `<div class="holbar">${hmap[ymd(S.calSel)].map(h => `<span class="holchip ${h.kind === 'r' ? 'soft' : ''}">${ic('star', 15)} ${esc(h.name)}${h.custom && isModAdmin('schedule') ? `<button class="x" data-hdel="${esc(h.name)}" aria-label="Remove">${ic('x', 14)}</button>` : ''}</span>`).join('')}</div>` : ''}
      ${edit ? `<div class="edbar">${ic('edit', 18)}<span>${isModAdmin('schedule') ? 'Tap a name to change the shift, or add a person.' : 'Tap a name from your area to change the shift.'}</span>${isModAdmin('schedule') ? `<button class="btn sm" id="sadd">${ic('plus', 18)} Add</button>` : ''}</div>` : ''}
      ${rows.length ? grp('A','a','A Shift · 7 AM – 3 PM',by('A')) + grp('B','b','B Shift · 3 PM – 11 PM',by('B')) + grp('C','c','C Shift · 11 PM – 7 AM',by('C')) + grp('L','l','Leave',by('L')) + grp('WO','wo','Weekly Off',by('WO'))
          + (!by('A').length && !by('B').length && !by('C').length && !by('L').length && !by('WO').length ? '<div class="empty" style="padding:18px 20px">Only general shift on this date – see Area-wise below.</div>' : '')
        : '<div class="empty" style="padding:26px 20px">No schedule uploaded for this date.</div>'}
    </section>
    ${general.length ? `<section class="card" style="overflow:hidden"><div class="boxh g-area"><h2>Area-wise · General Shift</h2></div>
      ${Object.keys(areaMap).sort().map(a => `<div class="arow"><span class="an">${esc(a)}</span><div>${areaMap[a].map(p => `<div class="pp${edit && canEdP(p) ? ' ed' : ''}${sameName(p.name, ME.name) ? ' me' : ''}" data-nm="${esc(p.name)}" ${edit && canEdP(p) ? `data-p="${esc(p.name)}" role="button" tabindex="0"` : ''}><span>${esc(p.name)}</span>${p.edited_by ? `<span class="edmark">${ic('edit', 13)}</span>` : ''}</div>`).join('')}</div></div>`).join('')}
    </section>` : ''}</div>`;
  $('#pm').onclick = () => { S.calMonth = new Date(y, mo - 1, 1); viewSchedule(); };
  $('#nm').onclick = () => { S.calMonth = new Date(y, mo + 1, 1); viewSchedule(); };
  $('#calt').onclick = () => { S.calOpen = !S.calOpen; viewSchedule(); };
  $$('#sc [data-day]').forEach(b => b.onclick = () => { S.calSel = fromYmd(b.dataset.day); S.calOpen = false; viewSchedule(); });
  if ($('#sedit')) $('#sedit').onclick = () => { S.schedEdit = !S.schedEdit; viewSchedule(); };
  if ($('#shol')) $('#shol').onclick = () => {
    const md = $('#modal');
    md.innerHTML = `<div class="sheet"><h3>Holiday / festival</h3><p>${fmtDay(S.calSel)}</p>
      <div class="fld"><label for="hn">Name</label><input id="hn" maxlength="60" placeholder="e.g. Plant shutdown, Vishwakarma Puja" autocomplete="off"></div>
      <div class="two"><button class="btn ghost" id="hx">Cancel</button><button class="btn pri" id="hg">Add</button></div></div>`;
    md.classList.remove('hidden'); md.onclick = null; $('#hn').focus();
    $('#hx').onclick = () => md.classList.add('hidden');
    $('#hg').onclick = async () => { const n = $('#hn').value.trim(); if (!n) return toast('Type a name');
      try { await api('holidays', { method: 'POST', body: { day: ymd(S.calSel), name: n, kind: 'plant', created_by: ME.name }, prefer: 'return=minimal' });
        logAct('schedule', 'Holiday added', `${fmtShort(S.calSel)} · ${n}`); md.classList.add('hidden'); toast('Holiday added'); viewSchedule(); } catch (e) { netErr(e); } };
  };
  $$('#sc [data-hdel]').forEach(b => b.onclick = async () => { const n = b.dataset.hdel;
    if (!(await ask('Remove this holiday?', n, 'Remove'))) return;
    try { await api(`holidays?day=eq.${ymd(S.calSel)}&name=eq.${encodeURIComponent(n)}`, { method: 'DELETE', prefer: 'return=minimal' });
      logAct('schedule', 'Holiday removed', `${fmtShort(S.calSel)} · ${n}`); viewSchedule(); } catch (e) { netErr(e); } });
  // long press on a name: small Call / Mail popup (contact details come from Team)
  { let lp = null, fired = false; const sc = $('#sc');
    const st = e => { const t = e.target.closest('[data-nm]'); if (!t) return; fired = false; clearTimeout(lp);
      lp = setTimeout(() => { fired = true; try { if (navigator.vibrate) navigator.vibrate(15); } catch (x) {} contactSheet(t.dataset.nm); }, 550); };
    const en = () => clearTimeout(lp);
    sc.addEventListener('touchstart', st, { passive: true }); sc.addEventListener('mousedown', st);
    ['touchend', 'touchmove', 'touchcancel', 'mouseup', 'mouseleave'].forEach(ev => sc.addEventListener(ev, en, { passive: true }));
    sc.addEventListener('contextmenu', e => { if (e.target.closest('[data-nm]')) e.preventDefault(); });
    sc.addEventListener('click', e => { if (fired) { fired = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true); }
  if (!edit) return;
  const day = ymd(S.calSel);
  const setShift = async (p, sh) => {
    try { if (isModAdmin('schedule')) await rpc('hsm_set_shift', { p_day: day, p_name: p.name, p_sap_id: p.sap_id || null, p_shift: sh, p_area: p.area || null });
      else await rpc('hsm_set_shift_inc', { p_day: day, p_name: p.name, p_sap_id: p.sap_id || null, p_shift: sh });
      if (!sh) logAct('schedule', 'Removed from schedule', `${p.name} · ${fmtShort(S.calSel)}`);
      toast(sh ? `${p.name}: ${SHIFT_NAME[sh]}` : `${p.name} removed from ${fmtShort(S.calSel)}`); viewSchedule(); }
    catch (e) { netErr(e); }
  };
  const pick = (p, isNew) => {
    const md = $('#modal');
    md.innerHTML = `<div class="sheet"><h3>${esc(p.name)}</h3><p>${fmtDay(S.calSel)}${p.shift ? ` · now <b>${esc(SHIFT_NAME[p.shift])}</b>` : ''}</p>
      <div class="shpick">${['A','B','C','G','L','WO'].map(k => `<button class="sp-${k.toLowerCase()} ${p.shift === k ? 'on' : ''}" data-sh="${k}"><b>${k}</b><span>${SHIFT_NAME[k]}</span></button>`).join('')}</div>
      ${isNew || !isModAdmin('schedule') ? '' : `<button class="btn ghost block" data-sh="__x" style="color:var(--red)">${ic('x')} Remove from this date</button>`}
      <button class="btn ghost block" data-sh="__c">Cancel</button></div>`;
    md.classList.remove('hidden');
    md.onclick = e => { const b = e.target.closest('[data-sh]'); if (!b && e.target !== md) return; md.classList.add('hidden'); md.onclick = null;
      if (!b || b.dataset.sh === '__c') return; setShift(p, b.dataset.sh === '__x' ? null : b.dataset.sh); };
  };
  $('#sc').addEventListener('click', e => { const t = e.target.closest('[data-p]'); if (!t) return; const p = rows.find(r => r.name === t.dataset.p); if (p) pick(p); });
  if ($('#sadd')) $('#sadd').onclick = async () => {
    let people = []; try { people = await team(); } catch (e) {}
    const md = $('#modal');
    md.innerHTML = `<div class="sheet" style="max-height:80vh;display:flex;flex-direction:column"><h3>Add a person to ${fmtShort(S.calSel)}</h3>
      <div class="search" style="margin:4px 0 8px">${ic('search', 20)}<input id="aq" type="search" placeholder="Search name" aria-label="Search name"></div>
      <div id="al2" style="overflow:auto;flex:1"></div><button class="btn ghost block" id="acx">Cancel</button></div>`;
    md.classList.remove('hidden'); md.onclick = null;
    const draw = q => { const f = people.filter(p => !q || p.name.toLowerCase().includes(q)).slice(0, 60);
      $('#al2').innerHTML = f.map(p => `<button class="lrow" data-n="${esc(p.name)}"><span class="tx"><span class="a" style="font-size:16px">${esc(p.name)}</span><span class="b">${esc(p.area || '')}${p.sap_id ? ' · ' + esc(p.sap_id) : ''}</span></span></button>`).join('') || '<div class="empty">No match</div>'; };
    draw('');
    $('#aq').oninput = e => draw(e.target.value.trim().toLowerCase());
    $('#acx').onclick = () => md.classList.add('hidden');
    $('#al2').onclick = e => { const b = e.target.closest('[data-n]'); if (!b) return; const p = people.find(x => x.name === b.dataset.n);
      md.classList.add('hidden'); const cur = rows.find(r => (p.sap_id && r.sap_id === p.sap_id) || sameName(r.name, p.name));
      pick(cur || { name: p.name, sap_id: p.sap_id, area: p.area }, !cur); };
  };
}

/* ================= CHECK LISTS ================= */
const draftKey = code => `hsm_cl2_${code}`;
// One record per check list for the whole day (any shift): later readings replace earlier ones, so an edited-down value really replaces the old one
const dayMerge = rows => { const sh = {}; rows.forEach(r => { const a = sh[r.template_code] = sh[r.template_code] || []; if (r.shift && !a.includes(r.shift)) a.push(r.shift); });
  return mergeEntries(rows.map(r => ({ ...r, shift: '' }))).map(m => ({ ...m, shift: (sh[m.template_code] || []).join('/') })); };
const tplHave = (t, V) => { let n = 0; t.sections.forEach((s, si) => s.items.forEach((it, ii) => it.cells.forEach((c, fi) => { if (c && V && V[`${si}.${ii}.${fi}`]) n++; }))); return n; };
const TIDX = {};
const tplIdx = t => TIDX[t.code] || (TIDX[t.code] = t.sections.flatMap((s, si) => s.items.map((it, ii) => ({ si, ii, txt: (s.title + ' ' + it.name + ' ' + it.cells.map((c, fi) => c ? (s.fields[fi] || {}).l || '' : '').join(' ')).toLowerCase() }))));
const secStat = (t, si, V) => { let n = 0, h = 0; t.sections[si].items.forEach((it, ii) => it.cells.forEach((c, fi) => { if (c) { n++; if (V && V[`${si}.${ii}.${fi}`]) h++; } })); return { n, h }; };
const secHit = (t, si, q) => { const w = qWords(q); return w.length ? tplIdx(t).filter(x => x.si === si && w.every(k => x.txt.includes(k))).length : 0; };
const qWords = q => String(q || '').toLowerCase().split(/\s+/).filter(Boolean);
const qHit = (t, q) => { const w = qWords(q); if (!w.length) return 0; return tplIdx(t).filter(x => w.every(k => x.txt.includes(k))).length + (w.every(k => t.name.toLowerCase().includes(k)) ? 1 : 0); };
async function viewChecklist() {
  $('#app').innerHTML = `${bar('Check List', 'home', logBtn('checklist') + (can('clset') ? `<button class="ib" id="clgear" aria-label="Check list settings">${ic('gear', 26)}</button>` : ''))}<main class="scroll" id="cl"><div class="spin">Loading…</div></main>${nav('checklist')}`;
  if ($('#clgear')) $('#clgear').onclick = () => go('clset');
  const today = ymd(new Date()); S.reportDate = S.reportDate || today; S.clQ = S.clQ || '';
  try {
    const tpl = await templates();
    let done = []; try { done = await api(`checklist_entries?select=template_code,check_date,created_at,filled_at,inspected_name,shift,vals,client_id&check_date=eq.${today}&order=created_at.desc`); } catch (e) { if (!isNet(e)) throw e; }
    const waiting = outbox(), have = new Set(done.map(r => r.client_id).filter(Boolean));
    const recs = {}; dayMerge([...obxEntries(today).filter(r => !have.has(r.client_id)), ...done]).forEach(m => { recs[m.template_code] = m; });
    const areas = CL_AREAS.filter(([a]) => tpl.some(t => t.area === a));
    if (!areas.length) { $('#cl').innerHTML = `<div class="empty"><b>No check lists for you yet</b>Ask ${esc(ADMIN_NAME)} to give you access to your area.</div>`; return; }
    if (!areas.some(([a]) => a === S.clArea)) S.clArea = areas[0][0];
    // sub-tree = one section of a check list (e.g. “FM DC Motors – OP side”); an area's sub-trees are all its sections in order
    const subsOf = a => tpl.filter(t => t.area === a).flatMap(t => t.sections.map((sc, si) => { const m = recs[t.code], dr = store.get(draftKey(t.code)), x = secStat(t, si, m && m.vals);
      return { t, si, title: sc.title, n: x.n, h: x.h, draft: !!(dr && dr.v && Object.keys(dr.v).some(k => k.startsWith(si + '.') && dr.v[k])) }; }));
    const multi = a => tpl.filter(t => t.area === a).length > 1, lab = (a, x) => multi(a) ? `${x.t.name} › ${x.title}` : x.title;
    $('#cl').innerHTML = `<div class="tabs cltabs" id="clt" role="tablist"></div>
      <div class="clq" style="border-top:1px solid var(--line)"><div class="search">${ic('search', 22)}<input id="clq" type="search" placeholder="Search reading – motor, pump, panel…" aria-label="Search all check lists" value="${esc(S.clQ)}"></div></div>
      <div class="clstw"><div class="clstl">Sub-trees of ${esc(clAreaName(S.clArea))} · ${fmtDay(new Date())}</div><div class="clstv" id="clst" role="list"></div><div class="clmsg" id="clmsg"></div></div>
      <div class="pad">
      ${waiting.length ? `<div class="card obx"><span class="ic">${ic('clock', 24)}</span><div style="flex:1"><div class="t">${waiting.length} check list${waiting.length > 1 ? 's' : ''} saved on this phone</div>
        <div class="s">${waiting.some(x => x.err) ? 'Upload problem: ' + esc(waiting.find(x => x.err).err) : 'Will upload by itself when the network is back'}</div></div><button class="btn" id="obxgo">Upload now</button></div>` : ''}
      <button class="card actcard" id="actc" data-go="actions"><span class="ic">${ic('alert', 26)}</span><span class="tx"><span class="a">Daily action required</span><span class="b" id="actn">Checking abnormal readings…</span></span><span class="chev">${ic('chev', 20)}</span></button>
      <div class="card report" style="margin-top:18px"><div class="row"><span class="ic">${ic('xls', 26)}</span><div style="flex:1"><div class="t">${esc(clAreaName(S.clArea))} – final report (Excel)</div><div class="s">Save / Share works only when <b>every sub-tree</b> of this area is filled for the date.</div></div></div>
        <div class="row"><input type="date" id="rdate" value="${S.reportDate}" max="${today}" aria-label="Report date"></div>
        <div class="two"><button class="btn" id="rsave">${ic('download')} Save</button><button class="btn pri" id="rshare">${ic('share')} Share / Mail</button></div></div></div>`;
    const draw = () => { const q = S.clQ.trim(), list = subsOf(S.clArea);
      $('#clt').innerHTML = areas.map(([a, l]) => { const n = subsOf(a), d = n.filter(x => x.h >= x.n).length, hits = q ? n.filter(x => secHit(x.t, x.si, q)).length : 0;
        return `<button role="tab" data-a="${a}" class="${a === S.clArea ? 'on' : ''}" aria-selected="${a === S.clArea}">${esc(l)}<span class="cnt ${d === n.length ? 'all' : ''}">${d}/${n.length}</span>${hits && a !== S.clArea ? `<i class="mk">${hits}</i>` : ''}</button>`; }).join('');
      $('#clst').innerHTML = list.map((x, i) => { const full = x.h >= x.n, hit = q && secHit(x.t, x.si, q);
        return `<button type="button" role="listitem" data-i="${i}" class="${full ? 'ok' : x.h || x.draft ? 'part' : ''}${hit ? ' hit' : q ? ' dim' : ''}"><span class="nm2">${esc(lab(S.clArea, x))}${x.draft && !full ? '<i class="dr" title="Draft saved"></i>' : ''}${hit ? `<em class="mt">${ic('search', 14)} ${hit} found</em>` : ''}</span><span class="cnt ${full ? 'all' : ''}">${x.h}/${x.n}</span></button>`; }).join('');
      const pend = list.filter(x => x.h < x.n);
      let msg = '';
      if (q) { const here = list.filter(x => secHit(x.t, x.si, q)), other = areas.filter(([a]) => a !== S.clArea).map(([a, l]) => [l, subsOf(a).filter(x => secHit(x.t, x.si, q)).length]).filter(([, n]) => n);
        msg = (!here.length && !other.length) ? `<span style="color:var(--red)"><b>No reading matches “${esc(q)}”.</b></span>` : `<b>${here.length ? `${here.length} sub-tree${here.length > 1 ? 's' : ''} here ${here.length > 1 ? 'have' : 'has'} it – tap the highlighted one.` : 'No match in this area.'}</b>${other.length ? ` Also in: ${other.map(([l, n]) => `${esc(l)} (${n})`).join(', ')}` : ''}`; }
      $('#clmsg').innerHTML = msg; $('#clmsg').hidden = !msg;
      const on = $('#clt .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); };
    draw();
    abnormalFor(today).then(d => { const el = $('#actn'); if (!el) return; const n = d.items.length;
      el.innerHTML = n ? `<b style="color:var(--red)">${n} abnormal reading${n > 1 ? 's' : ''}</b> · tap to see area-wise` : 'All readings normal today'; if (n) $('#actc').classList.add('bad'); }).catch(() => { const el = $('#actn'); if (el) el.textContent = 'Tap to open'; });
    $('#clt').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; S.clArea = b.dataset.a; viewChecklist(); };
    $('#clst').onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const x = subsOf(S.clArea)[+b.dataset.i], q = S.clQ.trim();
      S.clSec = { code: x.t.code, v: String(x.si) }; S.clJump = q && secHit(x.t, x.si, q) ? { code: x.t.code, q } : null; go('cl/' + x.t.code); };
    $('#clq').oninput = e => { S.clQ = e.target.value; draw(); };
    $('#rdate').onchange = e => { S.reportDate = e.target.value || today; };
    $('#rsave').onclick = () => areaReport(S.clArea, S.reportDate, false);
    $('#rshare').onclick = () => areaReport(S.clArea, S.reportDate, true);
    if ($('#obxgo')) $('#obxgo').onclick = async () => { toast('Uploading…'); const n = await flushOutbox(); if (!n && outbox().length) toast('Still no network – will try again automatically'); };
  } catch (e) { $('#cl').innerHTML = '<div class="empty"><b>Could not load check lists</b>Check network and try again.</div>'; netErr(e); }
}
// Final Excel of ONE area – only when every sub-tree (check list) of the area is completely filled for that date
async function areaReport(area, day, share) {
  toast('Checking sub-trees…', 8000);
  try {
    const tpl = await templates(), list = tpl.filter(t => t.area === area);
    let rows = [], off = false;
    try { rows = await api(`checklist_entries?select=*&check_date=eq.${day}&order=created_at`, { fresh: true }); } catch (e) { if (!isNet(e)) throw e; off = true; }
    const have = new Set(rows.map(r => r.client_id).filter(Boolean));
    rows = [...rows, ...obxEntries(day).filter(r => !have.has(r.client_id))].filter(r => list.some(t => t.code === r.template_code));
    const merged = dayMerge(rows);
    const pend = list.flatMap(t => { const m = merged.find(x => x.template_code === t.code); return t.sections.map((sc, si) => { const x = secStat(t, si, m && m.vals); return { name: (list.length > 1 ? t.name + ' › ' : '') + sc.title, n: x.n, h: x.h }; }); }).filter(x => x.h < x.n);
    if (pend.length) {
      const m = $('#modal'); m.innerHTML = `<div class="sheet"><h3>Sub-tree pending</h3><p class="hint" style="margin:4px 0 10px">${esc(clAreaName(area))} report for ${fmtShort(fromYmd(day))} can be saved or shared only after every sub-tree is filled. These are still pending:</p>
        ${pend.map(x => `<div class="pendr"><b>${esc(x.name)}</b><span>${x.h ? `${x.n - x.h} of ${x.n} left` : 'not started'}</span></div>`).join('')}
        <button class="btn pri block" id="pdok" style="margin-top:14px">OK</button></div>`;
      m.classList.remove('hidden'); const close = () => m.classList.add('hidden'); $('#pdok').onclick = close; m.onclick = e => { if (e.target === m) close(); }; return; }
    if (!list.length) { toast('No check lists in this area'); return; }
    if (off || OFFLINE) toast('No network: report made from data on this phone', 4000);
    const buf = await xl().dailyWorkbook(list, merged, day);
    deliver(buf, `HSM E&A ${clAreaName(area)} Checklist ${fmtShort(fromYmd(day))}.xlsx`, share);
  } catch (e) { netErr(e); }
}
async function recordReport(tpl, entry, share) {
  try { toast('Preparing Excel…', 6000); const buf = await xl().recordWorkbook(tpl, entry);
    deliver(buf, `${tpl.name.replace(/[\\/:*?"<>|]/g, '-')} ${fmtShort(fromYmd(entry.check_date))} Shift ${entry.shift || ''}.xlsx`, share);
  } catch (e) { netErr(e); }
}
/* Several submissions of the same check list (same day + shift) are one record: later readings fill the gaps / replace earlier ones */
const entryKey = r => `${r.template_code}|${r.check_date}|${r.shift || ''}`;
function mergeEntries(rows) {
  const g = {}, at = r => String(r.filled_at || r.created_at || '');
  rows.slice().sort((a, b) => at(a) < at(b) ? -1 : at(a) > at(b) ? 1 : 0).forEach(r => {
    const m = g[entryKey(r)] || (g[entryKey(r)] = { ...r, vals: {}, parts: [], names: [], rem: [], local: false });
    Object.assign(m.vals, r.vals || {});
    m.parts.push({ id: r.id, name: r.inspected_name, at: at(r), n: Object.keys(r.vals || {}).length });
    if (r.inspected_name && !m.names.includes(r.inspected_name)) m.names.push(r.inspected_name);
    if (r.remarks && !m.rem.includes(r.remarks)) m.rem.push(r.remarks);
    m.filled_at = at(r); m.created_at = at(r); m.id = r.id; m.local = m.local || !!r.local; m.inspected_by = r.inspected_by;
  });
  return Object.values(g).map(m => ({ ...m, inspected_name: m.names.join(' / '), remarks: m.rem.join(' | ') || null, nparts: m.parts.length }));
}
// every submission of one check list on one day (cloud + still waiting on this phone), merged per shift
async function dayEntries(code, day) {
  let rows = []; try { rows = await api(`checklist_entries?select=*&template_code=eq.${encodeURIComponent(code)}&check_date=eq.${day}&order=created_at`); } catch (e) { if (!isNet(e)) throw e; }
  const have = new Set(rows.map(r => r.client_id).filter(Boolean));
  return [...rows, ...obxEntries(day).filter(r => r.template_code === code && !have.has(r.client_id))];
}
const countFlags = (t, V) => { let nok = 0, hot = 0;
  t.sections.forEach((s, si) => s.items.forEach((it, ii) => it.cells.forEach((c, fi) => { const v = V[`${si}.${ii}.${fi}`]; if (!c || !v) return;
    if (v === 'NOT OK') nok++; if (isHot(ftype(s, it, fi), v, limOf(t.code, si))) hot++; }))); return { nok, hot }; };

async function viewChecklistFill(code) {
  $('#app').innerHTML = `${bar('Check List', 'checklist')}<main class="scroll"><div class="spin">Loading…</div></main>`;
  let t; try { t = (await templates()).find(x => x.code === code); } catch (e) { netErr(e); }
  if (!t) { $('#app').innerHTML = `${bar('Check List', 'checklist')}<div class="empty"><b>Check list not found</b>You may not have access to this area.</div>`; return; }
  const total = itemCount(t), day = ymd(new Date());
  let dr = store.get(draftKey(code)); if (dr && dr.d && dr.d !== day) { store.del(draftKey(code)); dr = null; }   // a draft belongs to its own date
  dr = dr || { v: {}, shift: curShift(), remarks: '' }; dr.d = day; const V = dr.v;
  const jump = S.clJump && S.clJump.code === code ? S.clJump.q : ''; S.clJump = null;
  // Readings already submitted TODAY for this check list (by anybody, any shift): shown in green, only the rest is entered now. Resets by itself next day.
  let priorRows = []; try { priorRows = await dayEntries(code, day); } catch (e) { netErr(e); }
  const prior = priorRows.length ? mergeEntries(priorRows.map(r => ({ ...r, shift: '' })))[0] : null, P = prior ? prior.vals : {};
  const val = k => V[k] != null && V[k] !== '' ? V[k] : (P[k] || '');
  const saved = k => !(V[k] != null && V[k] !== '') && !!P[k];
  const lim = k => limOf(code, +k.split('.')[0]);
  const btns = (k, opts) => `<span class="okg ${saved(k) ? 'sv' : ''}" data-k="${k}">${opts.map(o => `<button type="button" data-ok="${o}" class="${o === 'NOT OK' || o === 'OUT' ? 'nok ' : ''}${val(k) === o ? 'on' : ''}">${o}</button>`).join('')}</span>`;
  const input = (ty, k, label) => ty === 'ok' ? btns(k, ['OK', 'NOT OK']) : ty === 'io' ? btns(k, ['IN', 'OUT'])
    : `<input data-k="${k}" data-t="${ty}" class="${isHot(ty, val(k), lim(k)) ? 'hot' : ''}${saved(k) ? ' sv' : ''}" ${ty === 't' || ty === 'n' ? 'inputmode="decimal"' : ''} value="${esc(val(k))}" aria-label="${esc(label || 'Value')}" placeholder="${ty === 't' ? '°C' : ''}">`;
  const nPrior = prior ? Object.keys(P).length : 0;
  const secTot = t.sections.map(s => s.items.reduce((n, it) => n + it.cells.filter(Boolean).length, 0));
  let selSec = S.clSec && S.clSec.code === code ? S.clSec.v : 'all', onlyEmpty = false, qtxt = '';
  if (selSec !== 'all' && !t.sections[+selSec]) selSec = 'all';
  $('#app').innerHTML = `${bar(t.name, 'checklist', `<button class="ib" aria-label="Past records" data-go="clh/${esc(code)}">${ic('clock', 26)}</button>`)}
  <div class="clhead"><span>${fmtDay(new Date())}</span><span class="shiftsel" id="shs">${['A','B','C','G'].map(x => `<button type="button" data-s="${x}" class="${dr.shift === x ? 'on' : ''}" aria-pressed="${dr.shift === x}">${x}</button>`).join('')}</span></div>
  <div class="prog"><div id="pbar"></div></div>
  <div class="clq"><div class="search">${ic('search', 22)}<input id="clq" type="search" placeholder="Search reading – motor, pump, panel…" aria-label="Search readings"></div><button type="button" class="chip" id="clemp" aria-pressed="false">Only empty</button></div>
  ${t.sections.length > 1 ? `<div class="tabs cltabs clsc" id="clsc" role="tablist"></div>` : ''}
  <main class="scroll" id="clf"><div style="padding:6px 12px 24px">
    ${prior ? `<div class="resume">${ic('ok', 20)}<div><b>Today's check list is already started</b><span>${nPrior} of ${total} readings saved earlier today (${esc(prior.names.map(firstName).join(', '))}, last ${new Date(prior.filled_at).toTimeString().slice(0, 5)}). They are shown in <b style="display:inline">green</b> – fill only the rest. Tap “Only empty” to hide the filled ones.</span></div></div>` : ''}
    ${t.sections.map((s, si) => `<section class="clsecw" data-si="${si}" data-t="${esc(s.title.toLowerCase())}"><h2 class="clsec">${esc(s.title)}</h2>
      ${s.items.map((it, ii) => { const fs = it.cells.map((c, fi) => c ? fi : -1).filter(fi => fi >= 0);
        return `<div class="clitem" data-ks="${fs.map(fi => `${si}.${ii}.${fi}`).join(',')}" data-n="${esc((it.name + ' ' + fs.map(fi => (s.fields[fi] || {}).l || '').join(' ')).toLowerCase())}"><div class="cln">${esc(it.name)}</div><div class="clf ${fs.length === 1 ? 'one' : ''}">${fs.map(fi => { const ty = ftype(s, it, fi), l = (s.fields[fi] || {}).l || '';
          return `<label>${l ? `<span>${esc(l)}</span>` : ''}${input(ty, `${si}.${ii}.${fi}`, l || it.name)}</label>`; }).join('')}</div></div>`; }).join('')}</section>`).join('')}
    <div class="empty" id="clnone" hidden><b>Nothing to show</b>Change the search or the section.</div>
    <div class="fld" style="margin-top:18px"><label for="clrem">Remarks</label><textarea id="clrem" rows="3" placeholder="Abnormality found, action taken…">${esc(dr.remarks || '')}</textarea></div>
    <p class="hint" style="margin-top:12px">Inspected by ${esc(ME.name)}. Readings outside the set limit are shown in red. Readings stay on this phone until you submit.</p>
  </div></main>
  <div class="actions"><button class="btn ghost" type="button" id="clclear">Clear</button><button class="btn pri" type="button" id="clsub">Submit</button></div>`;
  const secFilled = () => t.sections.map((s, si) => { let n = 0; s.items.forEach((it, ii) => it.cells.forEach((c, fi) => { if (c && val(`${si}.${ii}.${fi}`)) n++; })); return n; });
  const filled = () => secFilled().reduce((a, b) => a + b, 0);
  const fresh = () => Object.keys(V).filter(k => V[k] && V[k] !== P[k]);
  const f = $('#clf');
  const drawChips = () => { const box = $('#clsc'); if (!box) return; const fl = secFilled();
    box.innerHTML = [['all', 'All', filled(), total], ...t.sections.map((s, si) => [String(si), s.title, fl[si], secTot[si]])].map(([k, l, a, b]) =>
      `<button role="tab" data-sc="${k}" class="${String(selSec) === k ? 'on' : ''}" aria-selected="${String(selSec) === k}">${esc(l)}<span class="cnt ${a === b ? 'all' : ''}">${a}/${b}</span></button>`).join('');
    const on = $('#clsc .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); };
  const updChips = () => { const box = $('#clsc'); if (!box) return; const fl = secFilled(), all = filled();
    $$('[data-sc]', box).forEach(b => { const k = b.dataset.sc, a = k === 'all' ? all : fl[+k], n = k === 'all' ? total : secTot[+k], c = $('.cnt', b); c.textContent = `${a}/${n}`; c.classList.toggle('all', a === n); }); };
  const applyFilter = () => { const q = qtxt.toLowerCase().trim();
    $$('.clsecw', f).forEach(w => { const si = w.dataset.si; let vis = 0;
      $$('.clitem', w).forEach(it => { let show = (selSec === 'all' || String(selSec) === si) && (!q || it.dataset.n.includes(q) || w.dataset.t.includes(q));
        if (show && onlyEmpty) show = it.dataset.ks.split(',').some(k => !val(k));
        it.hidden = !show; if (show) vis++; });
      w.hidden = !vis; });
    $('#clnone').hidden = $$('.clsecw:not([hidden])', f).length > 0; };
  const upd = () => { const n = filled(); $('#pbar').style.width = Math.min(100, 100 * n / total) + '%'; $('#clsub').innerHTML = `Submit <span style="font-size:15px;font-weight:600;opacity:.85">${n}/${total}</span>`; updChips(); };
  const persist = () => { dr.remarks = $('#clrem').value; store.set(draftKey(code), dr); upd(); };
  drawChips(); applyFilter(); upd();
  // coming from a search: mark the matching readings and land on the first one; otherwise come back to where you stopped
  S.clPos = S.clPos || {};
  if (jump) { const w = qWords(jump); const hits = $$('.clitem', f).filter(it => w.every(k => (it.dataset.n + ' ' + it.closest('.clsecw').dataset.t).includes(k)));
    hits.forEach(it => it.classList.add('hit')); if (hits[0]) { hits[0].classList.add('flash'); setTimeout(() => hits[0].scrollIntoView({ block: 'center' }), 60); } }
  else if (S.clPos[code] && S.clPos[code].d === day) setTimeout(() => { f.scrollTop = S.clPos[code].y; }, 30);
  f.addEventListener('scroll', () => { S.clPos[code] = { d: day, y: f.scrollTop }; }, { passive: true });
  if ($('#clsc')) $('#clsc').onclick = e => { const b = e.target.closest('[data-sc]'); if (!b) return; selSec = b.dataset.sc; S.clSec = { code, v: selSec };
    $$('#clsc button').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); }); applyFilter(); f.scrollTop = 0; };
  $('#clq').oninput = e => { qtxt = e.target.value; applyFilter(); };
  $('#clemp').onclick = e => { onlyEmpty = !onlyEmpty; e.currentTarget.classList.toggle('on', onlyEmpty); e.currentTarget.setAttribute('aria-pressed', onlyEmpty); applyFilter(); };
  f.addEventListener('input', e => { const k = e.target.dataset.k; if (!k) return; V[k] = e.target.value.trim(); e.target.classList.remove('sv');
    e.target.classList.toggle('hot', isHot(e.target.dataset.t, val(k), lim(k))); persist(); });
  f.addEventListener('click', e => { const b = e.target.closest('[data-ok]'); if (!b) return; const g = b.parentElement, k = g.dataset.k;
    V[k] = val(k) === b.dataset.ok && !P[k] ? '' : b.dataset.ok;   // an answer saved earlier cannot be un-ticked, only changed
    g.classList.remove('sv'); $$('button', g).forEach(x => x.classList.toggle('on', val(k) === x.dataset.ok)); persist(); });
  $('#shs').onclick = e => { const b = e.target.closest('[data-s]'); if (!b || dr.shift === b.dataset.s) return; dr.shift = b.dataset.s; persist(); viewChecklistFill(code); };
  $('#clclear').onclick = async () => { if (!Object.values(V).some(x => x)) return; if (await ask('Clear what you entered?', 'Readings already submitted earlier stay saved.', 'Clear')) { store.del(draftKey(code)); viewChecklistFill(code); } };
  $('#clsub').onclick = async () => {
    const add = {}; fresh().forEach(k => { const v = String(V[k]).trim(); if (v) add[k] = v; });
    const n = Object.keys(add).length, have = filled();
    if (!n) return toast(nPrior ? 'Nothing new to submit – fill the remaining readings' : 'Fill at least one reading');
    const sel = selSec !== 'all' ? t.sections[+selSec] : null, selTotal = sel ? secTot[+selSec] : total, selHave = sel ? secFilled()[+selSec] : have;
    if (selHave < selTotal && !(await ask('Submit what you have filled?', `${selTotal - selHave} of ${selTotal} readings${sel ? ' in “' + sel.title + '”' : ''} are still empty. You or a colleague can fill the rest later – everything is combined.`, 'Submit'))) return;
    const btn = $('#clsub'); btn.disabled = true; btn.textContent = 'Submitting…';
    try {
      const now = new Date();
      const body = { client_id: uid(), template_code: code, check_date: ymd(now), shift: dr.shift, filled_at: now.toISOString(),
        inspected_by: ME.username, inspected_name: ME.name, vals: add, remarks: $('#clrem').value.trim() || null };
      store.set(OBX, [...outbox(), { body, queued_at: now.toISOString() }]);
      store.del(draftKey(code));
      await flushOutbox();
      const pending = outbox().some(x => x.body.client_id === body.client_id);
      const all = Object.assign({}, P, add), { nok, hot } = countFlags(t, all);
      const left = t.sections.map((s, si) => ({ s, e: secTot[si] - s.items.reduce((c, it, ii) => c + it.cells.filter((x, fi) => x && all[`${si}.${ii}.${fi}`]).length, 0) })).filter(x => x.e > 0);
      const m = $('#modal');
      m.innerHTML = `<div class="sheet"><div class="status" style="padding:0"><div class="ring" style="background:${pending ? 'var(--amber-50,#FFF4E5);color:var(--amber)' : 'var(--green-50);color:var(--green)'}">${ic(pending ? 'clock' : 'ok', 40)}</div>
        <h2>${pending ? 'Saved on this phone' : 'Submitted'}</h2><p>${esc(t.name)}${sel ? ' · ' + esc(sel.title) : ''} · ${n} new reading${n > 1 ? 's' : ''} · ${Object.keys(all).length} of ${total} done today${nok ? ` · <b style="color:var(--red)">${nok} NOT OK</b>` : ''}${hot ? ` · <b style="color:var(--red)">${hot} out of limit</b>` : ''}</p>
        ${left.length ? `<p style="margin-top:8px;text-align:left"><b>Still empty:</b> ${left.map(x => `${esc(x.s.title)} (${x.e})`).join(', ')}</p>` : `<p style="margin-top:8px"><b>All readings of this check list are filled.</b> Use “Daily report (Excel)” on the Check List page to get the full Excel.</p>`}
        ${pending ? '<p style="margin-top:8px">No network here. It will upload by itself when the network is back – no need to fill it again.</p>' : ''}</div>
        <button class="btn pri block" id="mdone" style="margin-top:14px">Done</button></div>`;
      m.classList.remove('hidden');
      const close = () => { m.classList.add('hidden'); go('checklist'); };
      $('#mdone').onclick = close; m.onclick = e => { if (e.target === m) close(); };
      logAct('checklist', 'Check list submitted', `${t.name}${sel ? ' · ' + sel.title : ''} · Shift ${dr.shift} · ${n} new readings${nok ? ` · ${nok} NOT OK` : ''}${hot ? ` · ${hot} out of limit` : ''}`);
    } catch (e) { netErr(e); btn.disabled = false; upd(); }
  };
}

/* ================= CHECK LIST SETTINGS (red-alert limits per area / sub-area) ================= */
async function viewClSettings() {
  $('#app').innerHTML = `${bar('Check list settings', 'checklist')}<div class="tabs cltabs" id="cst" role="tablist"></div><main class="scroll" id="cs"><div class="spin">Loading…</div></main>`;
  let tpl; try { tpl = await templates(); } catch (e) { netErr(e); $('#cs').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  const areas = CL_AREAS.filter(([a]) => tpl.some(t => t.area === a) && canArea('clset', a));
  if (!areas.length) { $('#cs').innerHTML = `<div class="empty"><b>No areas for you yet</b>Ask ${esc(ADMIN_NAME)} for access to Checklist settings.</div>`; return; }
  if (!areas.some(a => a[0] === S.csArea)) S.csArea = areas[0][0];
  const hasTemp = (t, si) => t.sections[si].items.some((it, ii) => it.cells.some((c, fi) => c && ftype(t.sections[si], it, fi) === 't'));
  const draw = () => {
    const list = tpl.filter(t => t.area === S.csArea);
    $('#cst').innerHTML = areas.map(([a, l]) => `<button role="tab" data-a="${a}" class="${a === S.csArea ? 'on' : ''}" aria-selected="${a === S.csArea}">${esc(l)}</button>`).join('');
    $('#cs').innerHTML = `<div class="pad csp"><p class="hint" style="margin:0 0 10px">A temperature reading turns <b style="color:var(--red)">red</b> when it is above “Red above” (or below “Red below”, if filled). Default: above 100. Changes apply to everyone from now on.</p>
      ${list.map(t => `<div class="label" style="margin-top:14px">${esc(t.name)}</div>` + t.sections.map((s, si) => { if (!hasTemp(t, si)) return ''; const l = limOf(t.code, si);
        return `<div class="card cslim" data-k="${esc(t.code)}|${si}" style="padding:12px;margin-bottom:8px"><div style="font-weight:700;margin-bottom:8px">${esc(s.title)}</div>
          <div class="two"><div class="fld"><label>Red above (°C)</label><input type="number" inputmode="decimal" class="hi" value="${l.hi}"></div>
          <div class="fld"><label>Red below (°C)</label><input type="number" inputmode="decimal" class="lo" value="${l.lo != null ? l.lo : ''}" placeholder="optional"></div></div></div>`; }).join('')).join('') || '<div class="empty"><b>No check lists in this area</b></div>'}
      <button class="btn pri block" id="css" style="margin:14px 0 24px">Save ${esc(clAreaName(S.csArea))} limits</button></div>`;
    $('#cst').onclick = e => { const b = e.target.closest('[data-a]'); if (b) { S.csArea = b.dataset.a; draw(); } };
    $('#css').onclick = async () => {
      const next = { ...CL_LIM }; let bad = '';
      $$('.cslim').forEach(c => { const k = c.dataset.k, hiS = $('.hi', c).value.trim(), loS = $('.lo', c).value.trim(), hi = hiS === '' ? 100 : +hiS, lo = loS === '' ? null : +loS;
        if (isNaN(hi) || (lo != null && isNaN(lo)) || (lo != null && lo >= hi)) { bad = bad || 'Check the numbers – “below” must be lower than “above”'; return; }
        if (hi === 100 && lo == null) delete next[k]; else next[k] = { hi, lo }; });
      if (bad) return toast(bad);
      $('#css').disabled = true;
      try { await saveSetting('cl_limits', next); logAct('checklist', 'Alert limits changed', clAreaName(S.csArea)); toast('Limits saved'); draw(); } catch (e) { $('#css').disabled = false; netErr(e); } };
  };
  draw();
}

/* ================= DAILY ACTION REQUIRED (abnormal readings of all check lists) ================= */
// Abnormal = temperature above 100 or a NOT OK answer. Only the areas this person can see are included (admins see everything).
async function abnormalFor(day) {
  const tpl = await templates();
  let rows = []; try { rows = await api(`checklist_entries?select=*&check_date=eq.${day}&order=created_at`); } catch (e) { if (!isNet(e)) throw e; }
  const have = new Set(rows.map(r => r.client_id).filter(Boolean));
  rows = [...rows, ...obxEntries(day).filter(r => !have.has(r.client_id))];
  const items = [], notes = [];
  // only the areas given to this person (admins / check list admins: all); no area list = nothing, ask admin
  const mine = ME && ME.areas && Array.isArray(ME.areas.checklist) ? ME.areas.checklist : [], seeAll = isModAdmin('checklist');
  dayMerge(rows).forEach(r => {
    const t = tpl.find(x => x.code === r.template_code); if (!t || !(seeAll || mine.includes(t.area))) return;
    t.sections.forEach((s, si) => s.items.forEach((it, ii) => it.cells.forEach((c, fi) => {
      const v = c && (r.vals || {})[`${si}.${ii}.${fi}`]; if (!v) return;
      const hot = isHot(ftype(s, it, fi), v, limOf(t.code, si));
      if (v === 'NOT OK' || hot) items.push({ area: t.area, code: t.code, tname: t.name, shift: r.shift || '', equip: it.name, param: (s.fields[fi] || {}).l || s.title, value: v, kind: hot ? 'hot' : 'nok', by: r.inspected_name || '', at: r.filled_at || r.created_at });
    })));
    if (r.remarks) notes.push({ area: t.area, tname: t.name, shift: r.shift || '', text: r.remarks, by: r.inspected_name || '' });
  });
  return { items, notes, tpl };
}
const actionText = (day, d) => {
  const L = [`HSM E&A – Daily action required – ${fmtShort(fromYmd(day))}`, ''];
  const by = {}; d.items.forEach(i => { (by[i.area] = by[i.area] || []).push(i); });
  CL_AREAS.filter(([a]) => by[a]).forEach(([a, n]) => { L.push(`*${n}*`); by[a].forEach(i => L.push(`• ${i.tname} (${i.shift}) – ${i.equip}: ${i.param} = ${i.value}${i.kind === 'hot' ? ' °C (out of limit)' : ''}`)); L.push(''); });
  if (!d.items.length) L.push('No abnormal reading found.');
  return L.join('\n');
};
async function viewActions() {
  const today = ymd(new Date()); S.actDay = S.actDay || today;
  $('#app').innerHTML = `${bar('Daily action required', 'checklist')}<main class="scroll" id="ac"><div class="spin">Loading…</div></main>`;
  let d; try { d = await abnormalFor(S.actDay); } catch (e) { $('#ac').innerHTML = '<div class="empty"><b>Could not load</b>Check network and try again.</div>'; netErr(e); return; }
  const by = {}; d.items.forEach(i => { (by[i.area] = by[i.area] || []).push(i); });
  const nhot = d.items.filter(i => i.kind === 'hot').length, nnok = d.items.length - nhot;
  const doneN = new Set(); // check lists of the day that were filled
  $('#ac').innerHTML = `<div class="pad">
    <div class="card actsum ${d.items.length ? 'bad' : 'good'}"><span class="ic">${ic(d.items.length ? 'warn' : 'ok', 28)}</span><div style="flex:1"><div class="t">${d.items.length ? `${d.items.length} abnormal reading${d.items.length > 1 ? 's' : ''} need action` : 'All readings normal'}</div>
      <div class="s">${d.items.length ? `${nhot} out of limit · ${nnok} NOT OK` : 'No reading out of limit and no NOT OK so far'}${isModAdmin('checklist') ? ' · all areas' : ' · your areas only'}</div></div></div>
    <div class="row" style="margin:12px 0"><input type="date" id="adate" value="${S.actDay}" max="${today}" aria-label="Date"></div>
    ${d.items.length ? `<div class="two" style="margin-bottom:6px"><button class="btn" id="axl">${ic('xls')} Excel</button><button class="btn pri" id="ashare">${ic('share')} Share</button></div>` : ''}
    ${CL_AREAS.filter(([a]) => by[a]).map(([a, n]) => `<div class="label" style="margin-top:16px">${esc(n)} · ${by[a].length}</div><div class="card actl">${by[a].map(i => `<button class="actr ${i.kind}" data-go="cl/${esc(i.code)}">
        <span class="av2">${i.kind === 'hot' ? '🌡' : '!'}</span><span class="tx"><span class="a">${esc(i.equip)}</span><span class="b">${esc(i.param)} · ${esc(i.tname)} · Shift ${esc(i.shift)}</span><span class="c">${esc(firstName(i.by))} · ${new Date(i.at).toTimeString().slice(0, 5)}</span></span>
        <span class="val">${esc(i.value)}${i.kind === 'hot' ? '<small>°C</small>' : ''}</span></button>`).join('')}</div>`).join('')}
    ${d.notes.length ? `<div class="label" style="margin-top:20px">Remarks written by the team</div>${d.notes.map(n => `<div class="card" style="padding:12px 14px;margin-bottom:8px"><div class="hint">${esc(clAreaName(n.area))} · ${esc(n.tname)} · Shift ${esc(n.shift)} · ${esc(firstName(n.by))}</div><div style="font-size:16.5px;line-height:1.4;margin-top:3px">${esc(n.text)}</div></div>`).join('')}` : ''}
    <p class="hint" style="margin-top:16px;text-align:center">Built from all check lists submitted on this date (a check list filled in parts is read as one).</p></div>`;
  $('#adate').onchange = e => { S.actDay = e.target.value || today; viewActions(); };
  if ($('#axl')) $('#axl').onclick = async () => { try { toast('Preparing Excel…', 6000); const buf = await xl().actionsWorkbook(d.items, d.notes, S.actDay, n => clAreaName(n)); deliver(buf, `HSM E&A Action Required ${fmtShort(fromYmd(S.actDay))}.xlsx`, false); } catch (e) { netErr(e); } };
  if ($('#ashare')) $('#ashare').onclick = async () => { const text = actionText(S.actDay, d);
    try { if (navigator.share) await navigator.share({ title: 'HSM E&A – Daily action required', text }); else { await navigator.clipboard.writeText(text); toast('Summary copied – paste it in WhatsApp or mail'); } } catch (e) {} };
}

async function viewChecklistHistory(code) {
  $('#app').innerHTML = `${bar('Past records', 'checklist')}<main class="scroll" id="hh"><div class="spin">Loading…</div></main>`;
  try {
    const tpl = await templates();
    let rows = []; try { rows = await api(`checklist_entries?select=id,check_date,shift,inspected_name,vals,created_at,filled_at&template_code=eq.${encodeURIComponent(code)}&order=created_at.desc&limit=60`); } catch (e) { if (!isNet(e)) throw e; }
    rows = mergeEntries([...obxEntries().filter(r => r.template_code === code), ...rows]).sort((a, b) => (a.check_date + a.filled_at) < (b.check_date + b.filled_at) ? 1 : -1);
    const t = tpl.find(x => x.code === code);
    $('#hh').innerHTML = `<div class="pad"><div class="label">${esc(t ? t.name : code)} · last ${rows.length}</div>` + (rows.length ? `<div class="list">${rows.map(r => {
      const vals = Object.values(r.vals || {}); const { nok, hot } = t ? countFlags(t, r.vals || {}) : { nok: 0, hot: 0 };
      return `<button class="lrow" data-go="cle/${r.id}"><span class="tx"><span class="a">${fmtDay(fromYmd(r.check_date))} · Shift ${esc(r.shift || '-')}</span><span class="b">${r.local ? '<b style="color:var(--amber)">Waiting to upload</b> · ' : ''}${esc(r.inspected_name || '')} · ${vals.length} readings${r.nparts > 1 ? ` · ${r.nparts} submissions combined` : ''}${nok ? ` · <b style="color:var(--red)">${nok} NOT OK</b>` : ''}${hot ? ` · <b style="color:var(--red)">${hot} &gt;100 °C</b>` : ''}</span></span><span class="chev">${ic('chev', 22)}</span></button>`; }).join('')}</div>`
      : '<div class="empty"><b>No records yet</b>Submitted check lists appear here.</div>') + '</div>';
  } catch (e) { netErr(e); }
}
async function viewChecklistEntry(id) {
  $('#app').innerHTML = `${bar('Check list record', 'checklist')}<main class="scroll" id="ce"><div class="spin">Loading…</div></main>`;
  try {
    const tpl = await templates();
    const rows = id.startsWith('local:') ? obxEntries().filter(r => r.id === id) : await api(`checklist_entries?id=eq.${encodeURIComponent(id)}&select=*`);
    let r = rows[0]; const t = r && tpl.find(x => x.code === r.template_code);
    if (r && t) { const sib = (await dayEntries(r.template_code, r.check_date)).filter(x => (x.shift || '') === (r.shift || '')); r = mergeEntries(sib.length ? sib : [r])[0]; }
    if (!r || !t) { $('#ce').innerHTML = '<div class="empty"><b>Record not found</b></div>'; return; }
    const V = r.vals || {};
    const cell = (v, ty, si) => !v ? '<span style="color:var(--muted)">—</span>' : v === 'NOT OK' || v === 'OUT' ? `<b style="color:var(--red)">${esc(v)}</b>` : v === 'OK' || v === 'IN' ? `<span style="color:var(--green);font-weight:700">${esc(v)}</span>`
      : isHot(ty, v, limOf(t.code, si)) ? `<b style="color:var(--red)">${esc(v)}</b>` : esc(v);
    $('#ce').innerHTML = `<div class="dayhead"><div class="k">${esc(t.name)}</div><div class="v">${fmtDay(fromYmd(r.check_date))} · Shift ${esc(r.shift || '-')}</div><div style="font-size:15px;margin-top:2px">${esc(r.inspected_name || '')} · ${fmtStamp(r.filled_at || r.created_at)}${r.local ? ' · waiting to upload' : ''}</div>
        ${r.nparts > 1 ? `<div style="font-size:13.5px;margin-top:6px;opacity:.85">${r.nparts} submissions combined: ${r.parts.map(x => `${esc(firstName(x.name))} ${new Date(x.at).toTimeString().slice(0, 5)} (${x.n})`).join(' · ')}</div>` : ''}</div>
      <div style="padding:12px 16px 0" class="two"><button class="btn" id="esave">${ic('download')} Save Excel</button><button class="btn pri" id="eshare">${ic('share')} Share</button></div>
      <div style="padding:4px 12px 24px">${t.sections.map((s, si) => {
        const one = s.fields.length === 1;
        const rowsH = s.items.map((it, ii) => { const any = it.cells.some((c, fi) => c && V[`${si}.${ii}.${fi}`]);
          return `<tr${any ? '' : ' class="dim"'}><td>${esc(it.name)}</td>${s.fields.map((f, fi) => `<td class="v">${it.cells[fi] ? cell(V[`${si}.${ii}.${fi}`], ftype(s, it, fi), si) : '<span style="color:var(--muted)">·</span>'}</td>`).join('')}</tr>`; }).join('');
        return `<h2 class="clsec">${esc(s.title)}</h2><div class="card" style="overflow-x:auto"><table class="rt"><thead><tr><th>Equipment</th>${s.fields.map(f => `<th>${esc(f.l || (one ? 'Value' : ''))}</th>`).join('')}</tr></thead><tbody>${rowsH}</tbody></table></div>`; }).join('')}
      ${r.remarks ? `<h2 class="clsec">Remarks</h2><div class="card" style="padding:14px;font-size:17px;line-height:1.4">${esc(r.remarks)}</div>` : ''}</div>`;
    $('#esave').onclick = () => recordReport(t, r, false);
    $('#eshare').onclick = () => recordReport(t, r, true);
  } catch (e) { netErr(e); }
}

/* ================= SPARES ================= */
// Drop-down that opens right under the box: shows every option on tap, filters while typing,
// and (free = true) also takes a new value, which then appears in the list for everyone.
const combo = (id, value, free, ph = '') => `<div class="combo" data-combo="${id}"><input id="${id}" value="${esc(value || '')}" ${free ? '' : 'readonly'} autocomplete="off" placeholder="${esc(ph)}" role="combobox" aria-expanded="false"><button type="button" class="cbtn" tabindex="-1" aria-label="Show list">${ic('chev', 18)}</button><div class="cbl hidden" role="listbox"></div></div>`;
function wireCombo(id, options, free) {
  const box = $(`[data-combo="${id}"]`), inp = $('input', box), list = $('.cbl', box);
  let all = false;
  const show = () => {
    const opts = typeof options === 'function' ? options() : options, q = inp.value.trim().toLowerCase();
    const f = !free || all || !q || opts.some(o => o.toLowerCase() === q) ? opts : opts.filter(o => o.toLowerCase().includes(q));
    list.innerHTML = f.length ? f.map(o => `<button type="button" role="option" class="${o === inp.value ? 'on' : ''}" data-v="${esc(o)}">${esc(o)}</button>`).join('')
      : `<div class="cbe">${free && q ? `“${esc(inp.value.trim())}” will be added as a new location` : 'Nothing to show'}</div>`;
    list.classList.remove('hidden'); inp.setAttribute('aria-expanded', 'true');
    setTimeout(() => box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
  };
  const hide = () => { list.classList.add('hidden'); inp.setAttribute('aria-expanded', 'false'); all = false; };
  inp.addEventListener('focus', () => { all = true; show(); });
  inp.addEventListener('click', () => { all = true; show(); });
  inp.addEventListener('input', () => { all = false; show(); });
  $('.cbtn', box).addEventListener('click', () => { if (list.classList.contains('hidden')) { all = true; show(); inp.focus(); } else hide(); });
  list.addEventListener('mousedown', e => e.preventDefault());
  list.addEventListener('click', e => { const o = e.target.closest('[data-v]'); if (!o) return; inp.value = o.dataset.v; inp.dispatchEvent(new Event('change', { bubbles: true })); hide(); inp.blur(); });
  inp.addEventListener('blur', () => setTimeout(hide, 150));
}
// areas whose spares Excel this person may download: app/spares admin = all; area incharge = own areas only; others none
const spareXlsAreas = () => (ME.is_admin || isModAdmin('spares')) ? SPARE_AREAS : (ME.areas && Array.isArray(ME.areas.incharge) ? SPARE_AREAS.filter(a => ME.areas.incharge.includes(a)) : []);
function viewSpares() {
  $('#app').innerHTML = `${bar('Spares', 'home', `${logBtn('spares')}${ME.is_admin ? `<button class="ib" id="sset" aria-label="Spares settings">${ic('gear', 26)}</button>` : ''}${spareXlsAreas().length ? `<button class="ib" id="sxls" aria-label="Download spares Excel">${ic('download', 26)}</button>` : ''}<button class="ib" id="rbtn" aria-label="Refresh">${ic('refresh', 26)}</button>`)}
  <div class="searchwrap"><div class="search">${ic('search', 22)}<input id="sq" type="search" placeholder="Search item, model, make, location, cupboard" value="${esc(S.spareQuery)}" aria-label="Search spares"></div></div>
  <div class="tabs" role="tablist" id="tabs"><button data-a="__low" class="${S.spareLow ? 'on' : ''}" style="${S.spareLow ? 'background:var(--red);border-color:var(--red)' : ''}">Out / low stock</button>${SPARE_AREAS.map(a => `<button role="tab" data-a="${esc(a)}" class="${!S.spareLow && a === S.spareArea ? 'on' : ''}">${esc(a)}</button>`).join('')}</div>
  <main class="scroll" id="list" style="padding-bottom:90px"><div class="spin">Loading…</div></main>
  <button class="fab" data-go="spare/new" style="bottom:24px">${ic('plus', 24)} Add spare</button>`;
  if (!SPARE_AREAS.includes(S.spareArea)) S.spareArea = SPARE_AREAS[0];
  centerOn('#tabs .on');
  $('#tabs').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; if (b.dataset.a === '__low') S.spareLow = !S.spareLow; else { S.spareLow = false; S.spareArea = b.dataset.a; } viewSpares(); };
  $('#rbtn').onclick = loadSpares;
  if ($('#sxls')) $('#sxls').onclick = async () => { const ar = spareXlsAreas(); if (!ar.length) return;
    if (!(await ask('Download spares Excel?', ar.length === SPARE_AREAS.length ? 'All categories, one sheet each, in your HSM Spares format.' : `Your area${ar.length > 1 ? 's' : ''}: ${ar.join(', ')}`, 'Download'))) return;
    try { toast('Preparing Excel…', 8000); const rows = await api(`spares?select=*&order=area,id&area=in.(${ar.map(a => '"' + a.replace(/"/g, '') + '"').join(',')})`, { fresh: true });
      deliver(await xl().sparesWorkbook(rows, ar), `HSM Spares ${fmtShort(new Date())}.xlsx`, true); logAct('spares', 'Spares Excel downloaded', ar.length === SPARE_AREAS.length ? 'All areas' : ar.join(', ')); } catch (e) { netErr(e); } };
  if ($('#sset')) $('#sset').onclick = () => { const md = $('#modal');
    md.innerHTML = `<div class="sheet"><h3>Spares settings</h3><div class="fld"><label for="lown">Low stock: quantity below</label><input id="lown" type="number" inputmode="numeric" min="1" max="1000" value="${LOWN}"></div>
      <p class="hint" style="margin:6px 0 12px">Items with quantity 0 are “Out of stock”. Items below this number are “Low stock” (orange). Changes apply to everyone.</p>
      <div class="two"><button class="btn ghost" id="lx">Cancel</button><button class="btn pri" id="ls">Save</button></div></div>`;
    md.classList.remove('hidden'); md.onclick = e => { if (e.target === md) md.classList.add('hidden'); };
    $('#lx').onclick = () => md.classList.add('hidden');
    $('#ls').onclick = async () => { const n = Math.round(+$('#lown').value); if (!(n >= 1 && n <= 1000)) return toast('Enter a number from 1 to 1000');
      $('#ls').disabled = true; try { await saveSetting('low_stock', { n }); logAct('spares', 'Low stock limit changed', `below ${n}`); md.classList.add('hidden'); S.lowCache = null; toast(`Low stock is now below ${n}`); viewSpares(); } catch (e) { $('#ls').disabled = false; netErr(e); } }; };
  let tm; $('#sq').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { S.spareQuery = e.target.value.trim(); loadSpares(); }, 300); };
  loadSpares();
}
async function loadSpares(fromCache) {
  const list = $('#list'); if (!list) return;
  const q = S.spareQuery.replace(/[,()*"]/g, ' ').trim(); const e = encodeURIComponent(q);
  // plant-wide total per item (same item in many cupboards / areas is added up; low / nil is judged on that total)
  let path = `spares_v?select=id,area,material,model,make,description,qty,location,rack,cupboard,cupboard_key,low_hidden,item_total,places&order=${S.spareLow ? 'item_total' : 'qty'},material,id`;
  if (q) path += `&or=(material.ilike.*${e}*,model.ilike.*${e}*,make.ilike.*${e}*,description.ilike.*${e}*,location.ilike.*${e}*,item_code.ilike.*${e}*,cupboard.ilike.*${e}*,cupboard_key.ilike.*${e}*)`;
  if (S.spareLow) path += `&item_total=lt.${LOWN}&low_hidden=eq.${!!S.spareHid}`; else if (!q) path += `&area=eq.${encodeURIComponent(S.spareArea)}`;
  let notes = {}, lowRows = {};
  const tot = r => r.item_total != null ? r.item_total : r.qty, many = r => (r.places || 1) > 1;
  const qtyBox = (r, big) => `<span class="qty ${tot(r) <= 0 ? 'nil' : tot(r) < LOWN ? 'low' : ''}"><b>${big ? tot(r) : r.qty}</b><span>${tot(r) <= 0 ? 'NIL' : big ? 'TOTAL' : 'QTY'}</span>${many(r) ? `<small class="ptot">${big ? `here ${r.qty}` : `Total ${tot(r)}`}</small>` : ''}</span>`;
  const item = (r, showArea) => `<button class="item" data-go="spare/${r.id}">
      <span class="tx"><span class="n">${esc(r.material)}</span><span class="m">${esc([r.model, r.make].filter(Boolean).join(' · ') || r.description || '')}</span>
      <span class="loc">${ic('pin', 15)} ${esc(r.location || 'Location not set')}${r.rack ? ` · Rack ${esc(r.rack)}` : ''}${r.cupboard ? ` · Cupboard ${esc(r.cupboard)}` : ''}${r.cupboard_key ? ` · Key ${esc(r.cupboard_key)}` : ''}${showArea ? ` · ${esc(r.area)}` : ''}</span>${notes[r.id] ? `<span class="pnote">Planning: ${esc(notes[r.id].body)}</span>` : ''}</span>
      ${qtyBox(r)}</button>`;
  const planItem = r => `<button class="item" data-plan="${r.id}">
      <span class="tx"><span class="n">${esc(r.material)}</span><span class="m">${esc([r.model, r.make].filter(Boolean).join(' · ') || r.description || '')}</span>
      <span class="loc">${ic('pin', 15)} ${esc(r.location || 'Location not set')}${r.rack ? ` · Rack ${esc(r.rack)}` : ''}${r.cupboard ? ` · Cupboard ${esc(r.cupboard)}` : ''}${r.cupboard_key ? ` · Key ${esc(r.cupboard_key)}` : ''}</span>
      ${notes[r.id] ? `<span class="pnote">Planning: ${esc(notes[r.id].body)}</span>` : ''}</span>
      ${qtyBox(r, true)}</button>`;
  try {
    const lc = S.lowCache, cached = fromCache === true && S.spareLow && !q && lc && lc.hid === !!S.spareHid;
    let rows;
    if (cached) { rows = lc.rows; notes = lc.notes; }
    else {
      rows = await api(path);
      if (S.spareLow && rows.length) { try { const cm = await api(`spare_comments?select=spare_id,body,name,created_at&spare_id=in.(${rows.map(r => r.id).join(',')})&order=created_at.desc`); (cm || []).forEach(x => { if (!notes[x.spare_id]) notes[x.spare_id] = x; }); } catch (e) {} }
      if (S.spareLow && !q) S.lowCache = { rows, notes, hid: !!S.spareHid };
    }
    if (S.spareLow) {
      // out of stock (red, qty 0) and low stock (orange, qty below 5), area-wise; items removed by Planning/area admin are in the "Removed" view
      const tog = `<button class="linkbtn" id="shid" style="margin:0 16px 6px">${S.spareHid ? '← Back to out-of-stock list' : 'Show items removed by Planning'}</button>`;
      if (!rows.length) { list.innerHTML = `<div class="empty"><b>${S.spareHid ? 'No removed items' : 'Nothing out of stock or low'}</b></div>${tog}`; $('#shid').onclick = () => { S.spareHid = !S.spareHid; loadSpares(); }; return; }
      const by = {}; rows.forEach(r => (by[r.area] = by[r.area] || []).push(r));
      const order = [...SPARE_AREAS.filter(a => by[a]), ...Object.keys(by).filter(a => !SPARE_AREAS.includes(a))];
      if (S.lowArea !== 'all' && !by[S.lowArea]) S.lowArea = 'all';
      const sel = S.lowArea || 'all', z = rows.filter(r => tot(r) <= 0).length;
      const shown = sel === 'all' ? rows : by[sel];
      const chip = (k, lbl, list) => `<button data-la="${esc(k)}" class="lachip ${sel === k ? 'on' : ''}">${esc(lbl)}<b class="${list.some(r => tot(r) <= 0) ? '' : 'or'}">${list.length}</b></button>`;
      list.innerHTML = `<div class="lachips" id="lach">${chip('all', 'All areas', rows)}${order.map(a => chip(a, a, by[a])).join('')}</div>
        <div class="areahead"><b>${sel === 'all' ? 'All areas' : esc(sel)}</b><span>${shown.length} item${shown.length > 1 ? 's' : ''}</span></div>
        <div class="hint" style="padding:8px 16px 4px;font-weight:600">${S.spareHid ? 'Removed from list: ' : ''}${shown.filter(r => tot(r) <= 0).length} out of stock <span style="color:var(--red)">●</span> · ${shown.filter(r => tot(r) > 0).length} low (below ${LOWN}) <span style="color:#E8710A">●</span></div>${tog}`
        + (sel === 'all' ? order.map(a => `<div class="oosh"><span>${esc(a)}</span><span class="tag red">${by[a].length}</span></div>` + by[a].map(r => planItem(r)).join('')).join('') : shown.map(r => planItem(r)).join(''));
      rows.forEach(r => { lowRows[r.id] = r; });
      if (!cached || !S.planAreas) rpc('hsm_plan_areas').then(v => { S.planAreas = v; }).catch(() => { S.planAreas = S.planAreas || { all: false, areas: [] }; });
      list.onclick = e => { const b = e.target.closest('[data-plan]'); if (b) { e.preventDefault(); e.stopPropagation(); planSheet(lowRows[b.dataset.plan], notes, loadSpares); } };
      centerOn('#lach .on');
      $('#lach').onclick = e => { const b = e.target.closest('[data-la]'); if (b) { S.lowArea = b.dataset.la; loadSpares(true); } };
      $('#shid').onclick = () => { S.spareHid = !S.spareHid; loadSpares(); };
      return;
    }
    if (!rows.length) { list.innerHTML = `<div class="empty"><b>${q ? 'No match found' : 'No spares in this category yet'}</b>${q ? 'Try another word.' : 'Tap “Add spare” to add one.'}</div>`; return; }
    list.innerHTML = `<div class="areahead"><b>${q ? 'Search results' : esc(S.spareArea)}</b><span>${rows.length} item${rows.length > 1 ? 's' : ''}${q ? ' · all categories' : ''}</span></div>` + rows.map(r => item(r, !!q)).join('');
  } catch (err) { list.innerHTML = '<div class="empty"><b>Could not load spares</b>Check network and tap refresh.</div>'; netErr(err); }
}
// Planning sheet for one out-of-stock / low item (opened from the Out / low stock tab)
async function planSheet(r, notes, refresh) {
  if (!r) return;
  const pa = S.planAreas || { all: false, areas: [] }, can = pa.all || (pa.areas || []).includes(r.area), md = $('#modal');
  md.innerHTML = `<div class="sheet" style="max-height:92vh;overflow:auto"><h3>${esc(r.material)}</h3><div id="plbody"><div class="spin">Loading…</div></div></div>`;
  md.classList.remove('hidden'); md.onclick = e => { if (e.target === md) md.classList.add('hidden'); };
  let cm = []; try { cm = await api(`spare_comments?select=*&spare_id=eq.${r.id}&order=created_at.desc&limit=100`) || []; } catch (e) { netErr(e); }
  const hist = (all) => { const list = all ? cm : cm.slice(0, 5);
    return (list.length ? list.map(c => `<div class="pcmt"><b>${esc(c.name || '')}</b> <span class="hint">${fmtStamp(c.created_at)}</span><div>${esc(c.body)}</div></div>`).join('') : '<div class="hint">No planning update yet.</div>')
      + (!all && cm.length > 5 ? `<button class="linkbtn" id="plold">Show older (${cm.length - 5})</button>` : ''); };
  const quick = ['PR generated', 'Quotation requested from vendor', 'PO placed', 'Material in transit', 'High-value spare – kept below 5'];
  $('#plbody').innerHTML = `${can ? `<div class="label" style="margin:0 0 6px">Tap to write quickly</div><div class="chips" id="pq">${quick.map(t => `<button type="button" class="chip" data-q="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div class="fld" style="margin-top:10px"><label for="pt">Planning status / comment</label><textarea id="pt" rows="2" maxlength="450" placeholder="Type here"></textarea></div>
      <label class="admchk" style="margin:4px 0 12px"><input type="checkbox" id="ph"><span>${r.low_hidden ? 'Add back to out-of-stock list' : 'Remove from out-of-stock list'}</span></label>
      <div class="two"><button class="btn ghost" id="plx">Close</button><button class="btn pri" id="pls">Save</button></div>` : `<div class="hint" style="margin-bottom:8px">Only the Planning team can write here.</div><button class="btn ghost block" id="plx">Close</button>`}
    <div class="label" style="margin:16px 0 4px">Planning history</div><div id="phist">${hist(false)}</div>`;
  $('#plx').onclick = () => md.classList.add('hidden');
  const rewire = () => { if ($('#plold')) $('#plold').onclick = () => { $('#phist').innerHTML = hist(true); }; }; rewire();
  if (can) {
    $('#pq').onclick = e => { const b = e.target.closest('[data-q]'); if (b) { $('#pt').value = b.dataset.q; $('#pt').focus(); } };
    $('#pls').onclick = async () => { const t = $('#pt').value.trim(), h = $('#ph').checked;
      if (!t && !h) return toast('Write a status or tick the remove option');
      $('#pls').disabled = true;
      try { await rpc('hsm_spare_comment', { p_spare: r.id, p_body: t, p_hide: h ? !r.low_hidden : null }); md.classList.add('hidden'); toast('Saved'); refresh(); } catch (e) { $('#pls').disabled = false; netErr(e); } };
  }
}
let LOCS = null;
async function viewSpare(id) {
  const isNew = id === 'new';
  $('#app').innerHTML = `${bar(isNew ? 'Add Spare' : 'Update Spare', 'spares')}<main class="scroll" id="sd"><div class="spin">Loading…</div></main>`;
  let s = { area: S.spareArea, item_code: '', material: '', model: '', description: '', material_type: 'Spare', make: '', qty: 0, location: '', rack: '', cupboard: '', cupboard_key: '' }, log = [];
  try { const l = await rpc('hsm_spare_locations'); if (Array.isArray(l)) LOCS = l; } catch (e) { if (!isNet(e)) netErr(e); }
  if (!isNew) {
    try { const [r, l, tt] = await Promise.all([api(`spares?id=eq.${encodeURIComponent(id)}&select=*`), api(`spare_log?spare_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc&limit=6`),
        api(`spares_v?id=eq.${encodeURIComponent(id)}&select=item_total,places`).catch(() => [])]);
      if (!r.length) { $('#sd').innerHTML = '<div class="empty"><b>Spare not found</b></div>'; return; } s = r[0]; log = l; if (tt && tt[0]) { s.item_total = tt[0].item_total; s.places = tt[0].places; }
    } catch (e) { netErr(e); $('#sd').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  }
  const locs = () => [...new Set([...(LOCS || []), 'Basement Cupboard', 'FM TPS L1 Cupboard', 'Shift cupboard 1'])].sort((x, y) => x.localeCompare(y));
  const now = new Date(); let chg = 0;
  $('#app').innerHTML = `${bar(isNew ? 'Add Spare' : 'Update Spare', 'spares')}
  ${isNew ? '' : `<div class="cur"><span class="k">Current stock</span><span class="v">${s.qty} Nos</span></div>${(s.places || 1) > 1 ? `<div class="hint" style="padding:6px 16px 0;font-weight:600">Plant total of this item: <b>${s.item_total}</b> Nos in ${s.places} places – low stock is judged on this total.</div>` : ''}`}
  <main class="scroll"><form class="f" id="sf" autocomplete="off">
    <div class="fld"><label for="f-area">Area</label>${combo('f-area', s.area, false)}</div>
    <div class="fld"><label for="f-mat">Item</label><div class="combo" data-sug><input id="f-mat" value="${esc(s.material)}" required autocomplete="off" style="padding-right:12px!important"><div class="cbl hidden" id="sg-mat"></div></div>${isNew ? '<span class="hint">Type the name – an item already in the store fills its details by itself</span>' : ''}</div>
    <div class="fld"><label for="f-model">Type / Model</label><div class="combo" data-sug><input id="f-model" value="${esc(s.model || '')}" autocomplete="off" style="padding-right:12px!important"><div class="cbl hidden" id="sg-model"></div></div></div>
    <div class="fld"><label for="f-desc">Item description</label><textarea id="f-desc" rows="2">${esc(s.description || '')}</textarea></div>
    <div class="two"><div class="fld"><label for="f-make">Make (OEM)</label><input id="f-make" value="${esc(s.make || '')}"></div>
      <div class="fld"><label for="f-code">HSM Item Code</label><input id="f-code" value="${esc(s.item_code || '')}" autocapitalize="characters"></div></div>
    <div class="fld"><label for="f-qty">${isNew ? 'Opening quantity' : 'Update quantity'}</label>
      <div class="step"><button type="button" id="dec" aria-label="Decrease">${ic('minus', 28)}</button><input id="f-qty" inputmode="numeric" value="0"><button type="button" class="plus" id="inc" aria-label="Increase">${ic('plus', 28)}</button></div>
      <span class="hint" id="qhint">${isNew ? 'Stock you are adding now' : 'Minus = issued / used · Plus = received'}</span></div>
    <div class="fld"><label for="f-loc">Location</label>${combo('f-loc', s.location, true, 'Tap to choose or type a new one')}</div>
    <div class="two"><div class="fld"><label for="f-rack">Rack No.</label><input id="f-rack" value="${esc(s.rack || '')}"></div>
      <div class="fld"><label for="f-type">Material type</label>${combo('f-type', s.material_type || 'Spare', false)}</div></div>
    <div class="two"><div class="fld"><label for="f-cup">Cupboard No.</label><input id="f-cup" value="${esc(s.cupboard || '')}"></div>
      <div class="fld"><label for="f-key">Cupboard Key No.</label><input id="f-key" value="${esc(s.cupboard_key || '')}"></div></div>
    <div class="fld"><label for="f-rem">Remark (used for)</label><textarea id="f-rem" rows="2" placeholder="e.g. Replaced faulty module in F1 panel"></textarea></div>
    <div class="two"><div class="fld"><label>Updated by</label><input readonly value="${esc(ME.name)}"></div><div class="fld"><label>Date · time</label><input readonly value="${fmtShort(now)} ${pad2(now.getHours())}:${pad2(now.getMinutes())}"></div></div>
    ${log.length ? `<div><div class="label" style="margin-top:6px">Recent updates</div><div class="list">${log.map(h => `<div class="lrow"><span class="tag ${h.change < 0 ? 'red' : h.change > 0 ? 'green' : ''}">${h.change > 0 ? '+' : ''}${h.change}</span><span class="tx"><span class="a" style="font-size:15.5px">${esc(h.remark || (h.change ? 'Stock updated' : 'Details edited'))}</span><span class="b">→ ${h.qty_after} Nos · ${esc(h.updated_by || '')} · ${fmtStamp(h.created_at)}</span></span></div>`).join('')}</div></div>` : ''}
    <div style="height:40px"></div>
  </form></main>
  <div class="actions"><button class="btn ghost" type="button" id="cancel">Cancel</button><button class="btn pri" type="button" id="save">Save</button></div>`;
  wireCombo('f-area', SPARE_AREAS.includes(s.area) ? SPARE_AREAS : [...SPARE_AREAS, s.area], false);
  wireCombo('f-loc', locs, true);
  wireCombo('f-type', ['Spare', 'Consumable', 'Tool'], false);
  if (isNew) {   // an item that is already in the store (any area) brings its details along: item, model, description, make, code, type – never place or quantity
    let cat = S.spCat || null;
    if (!cat) api('spares_v?select=material,model,make,description,item_code,material_type,ik&order=material', { fresh: true }).then(rs => { const m = {};
      (rs || []).forEach(r => { const o = m[r.ik]; if (!o || String(r.description || '').length + String(r.item_code || '').length > String(o.description || '').length + String(o.item_code || '').length) m[r.ik] = r; });
      cat = S.spCat = Object.values(m); }).catch(() => {});
    const fillFrom = r => { $('#f-mat').value = r.material || ''; $('#f-model').value = r.model || ''; $('#f-desc').value = r.description || ''; $('#f-make').value = r.make || ''; $('#f-code').value = r.item_code || '';
      if (r.material_type) $('#f-type').value = r.material_type; toast('Details filled from the item already in the store – add only quantity and place', 4200); };
    const sug = (inp, list) => { const hide = () => list.classList.add('hidden');
      const show = () => { const w = inp.value.toLowerCase().split(/\s+/).filter(Boolean); if (!cat || !w.length || inp.value.trim().length < 2) return hide();
        const hit = cat.filter(r => { const t = [r.material, r.model, r.make, r.item_code].join(' ').toLowerCase(); return w.every(k => t.includes(k)); }).slice(0, 8);
        if (!hit.length) return hide();
        list.innerHTML = hit.map((r, i) => `<button type="button" data-i="${i}"><b>${esc(r.material)}</b><br><small style="color:var(--ink-2)">${esc([r.model, r.make].filter(Boolean).join(' · ') || r.description || '')}</small></button>`).join(''); list._hit = hit; list.classList.remove('hidden'); };
      inp.addEventListener('input', show); inp.addEventListener('blur', () => setTimeout(hide, 150));
      list.addEventListener('mousedown', e => e.preventDefault());
      list.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { fillFrom(list._hit[+b.dataset.i]); hide(); } }); };
    sug($('#f-mat'), $('#sg-mat')); sug($('#f-model'), $('#sg-model'));
  }
  const qi = $('#f-qty');
  const setQ = v => { chg = isNew ? Math.max(0, v) : Math.max(-s.qty, v); qi.value = (!isNew && chg > 0 ? '+' : '') + chg; if (!isNew) $('#qhint').textContent = chg ? `New stock will be ${s.qty + chg} Nos` : 'Minus = issued / used · Plus = received'; };
  $('#dec').onclick = () => setQ(chg - 1); $('#inc').onclick = () => setQ(chg + 1);
  qi.onchange = () => setQ(parseInt(qi.value.replace('+', ''), 10) || 0);
  $('#cancel').onclick = () => history.length > 1 ? history.back() : go('spares');
  $('#save').onclick = async () => {
    const v = id => $(id).value.trim() || null;
    const f = { area: $('#f-area').value, material: v('#f-mat'), model: v('#f-model'), description: v('#f-desc'), make: v('#f-make'), item_code: v('#f-code'),
      location: v('#f-loc'), rack: v('#f-rack'), material_type: $('#f-type').value, cupboard: v('#f-cup'), cupboard_key: v('#f-key') };
    if (!f.material) { toast('Enter the item name'); $('#f-mat').focus(); return; }
    const remark = v('#f-rem'); const by = `${ME.name} (${ME.username})`;
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      let sid = s.id;
      if (isNew) { const [row] = await api('spares', { method: 'POST', body: { ...f, qty: 0, updated_by: by } }); sid = row.id; }
      logAct('spares', isNew ? 'Spare added' : 'Spare stock changed', `${f.material || ''}${chg ? ' · change ' + (chg > 0 ? '+' : '') + chg : ''}${f.location ? ' · ' + f.location : ''}`);
      await rpc('adjust_spare2', { p_id: sid, p_change: chg, p_location: f.location, p_remark: remark || (isNew ? 'New spare added' : null), p_by: by,
        p_area: f.area, p_item_code: f.item_code, p_material: f.material, p_material_type: f.material_type, p_make: f.make, p_model: f.model, p_description: f.description, p_rack: f.rack,
        p_cupboard: f.cupboard, p_cupboard_key: f.cupboard_key });
      if (f.location && LOCS && !LOCS.includes(f.location)) LOCS.push(f.location);
      S.spareArea = f.area; S.spareLow = false; toast(isNew ? 'Spare added' : 'Saved');
      history.length > 1 ? history.back() : go('spares');
    } catch (e) { netErr(e); btn.disabled = false; btn.textContent = 'Save'; }
  };
}

/* ================= SOP & HIRAC ================= */
// bottom sheet: choose where something goes. opts = [[key,label]]; returns the key or '' when cancelled
function pickSheet(title, note, opts, cur) {
  return new Promise(res => { const md = $('#modal');
    md.innerHTML = `<div class="sheet" style="max-height:88vh;overflow:auto"><h3>${esc(title)}</h3>${note ? `<p style="word-break:break-all;max-height:84px;overflow:auto;margin:4px 0 8px">${note}</p>` : ''}
      <div class="list">${opts.map(([k, l]) => `<button class="lrow" data-k="${esc(k)}" style="${k === cur ? 'outline:2px solid var(--red)' : ''}"><span class="tx"><span class="a" style="font-size:16px">${esc(l)}</span></span><span class="chev">${ic('chev', 22)}</span></button>`).join('')}</div>
      <button class="btn ghost block" data-k="" style="margin-top:8px">Cancel</button></div>`;
    md.classList.remove('hidden'); md.onclick = ev => { const k = ev.target.closest('[data-k]'); if (!k && ev.target !== md) return; md.classList.add('hidden'); md.onclick = null; res(k ? k.dataset.k : ''); }; });
}
const DOC_OK = /\.(pdf|docx|xlsx|jpe?g|png)$/i;
const DOC_NO = 'Only PDF, Word (.docx), Excel (.xlsx) or picture files can be added. Save the file as PDF first – other types cannot be opened inside the app.';
function viewSop() {
  $('#app').innerHTML = `${bar('SOP & HIRAC', 'home', logBtn('sop'))}
    <div class="seg" id="sseg">${[['numbers','SOP No.'],['hirac','HIRAC'],['docs','Documents']].map(([k, l]) => `<button data-t="${k}" class="${S.sopTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div id="sbody" style="display:flex;flex-direction:column;flex:1;min-height:0"></div>`;
  $('#sseg').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { S.sopTab = b.dataset.t; S.sopQuery = ''; viewSop(); } };
  ({ numbers: sopNumbers, hirac: hiracList, docs: sopDocs })[S.sopTab]();
}
const hiracNos = s => (String(s || '').match(/ELEC\/(\d+)/g) || []).map(x => +x.split('/')[1]);
async function sopNumbers() {
  const b = $('#sbody');
  b.innerHTML = `<div class="searchwrap" style="border-top:1px solid var(--line)"><div class="search">${ic('search', 22)}<input id="q" type="search" placeholder="Search SOP no., HIRAC no. or job" value="${esc(S.sopQuery)}" aria-label="Search SOP and HIRAC"></div></div>
    <div class="tabs" id="gt">${SOP_GROUPS.map(g => `<button data-g="${esc(g)}" class="${g === S.sopGroup ? 'on' : ''}">${esc(g)}</button>`).join('')}</div>
    <main class="scroll" id="sl"><div class="spin">Loading…</div></main>`;
  let rows = [], hir = [];
  try { [rows, hir] = await Promise.all([api('sop_hirac?select=area,sr_no,activity,sop_no,hirac_no&order=sr_no'), hiracData()]); }
  catch (e) { netErr(e); $('#sl').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  const title = n => (hir.find(h => h.no === n) || {}).title;
  const draw = () => {
    const q = S.sopQuery.toLowerCase().replace(/\s+/g, ' ');
    const f = rows.filter(r => (S.sopGroup === 'All' || r.area === S.sopGroup) && (!q || [r.sr_no, r.sop_no, r.hirac_no, r.activity].some(v => (v || '').toLowerCase().includes(q))));
    $('#sl').innerHTML = `<div class="pad"><div class="label">${f.length} of ${rows.length} SOPs</div>` + (f.length ? `<div class="list">${f.map(r => { const hs = hiracNos(r.hirac_no);
      return `<div class="lrow" style="flex-direction:column;align-items:stretch;gap:0"><div style="display:flex;gap:10px;align-items:flex-start"><span class="tag soft">${esc(r.sr_no)}</span><span class="a" style="flex:1;font-size:17px;font-weight:600;line-height:1.3">${esc(r.activity)}</span><span class="tag">${esc(r.area)}</span></div>
        <div class="refbox"><span><span class="k">SOP NO.</span><span class="v">${esc(r.sop_no || '—')}</span></span>
        ${hs.length ? `<a class="v" style="display:flex;flex-direction:column;gap:2px;padding:8px 10px;background:var(--red-50);border-radius:10px;text-decoration:none" data-go="hirac/${hs[0]}"><span class="k" style="font-size:11.5px;font-weight:700;color:var(--red-700);letter-spacing:.6px">HIRAC NO. ›</span><span style="font-size:14.5px;font-weight:700;color:var(--red-700)">${hs.map(n => 'ELEC/' + pad2(n)).join(', ')}</span>${title(hs[0]) ? `<span style="font-size:13px;color:var(--ink-2)">${esc(title(hs[0]))}</span>` : ''}</a>`
          : `<span><span class="k">HIRAC NO.</span><span class="v" style="color:var(--muted)">Not applicable</span></span>`}</div></div>`; }).join('')}</div>` : '<div class="empty"><b>No match found</b>Try another number or word.</div>') + '</div>';
  };
  draw();
  let tm; $('#q').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { S.sopQuery = e.target.value.trim(); draw(); }, 200); };
  $('#gt').onclick = e => { const g = e.target.closest('[data-g]'); if (!g) return; S.sopGroup = g.dataset.g; $$('#gt button').forEach(x => x.classList.toggle('on', x === g)); draw(); };
}
async function hiracList() {
  const b = $('#sbody');
  b.innerHTML = `<div class="searchwrap" style="border-top:1px solid var(--line)"><div class="search">${ic('search', 22)}<input id="q" type="search" placeholder="Search HIRAC no., job or hazard" value="${esc(S.sopQuery)}" aria-label="Search HIRAC"></div></div>
    <main class="scroll" id="hl"><div class="spin">Loading…</div></main>`;
  let H = []; try { H = await hiracData(); } catch (e) { netErr(e); return; }
  const draw = () => {
    const q = S.sopQuery.toLowerCase();
    const f = H.filter(h => !q || String(h.no) === q.replace(/^0+/, '') || [h.title, h.ref, ...(h.acts || []), ...(h.hz || []).map(z => z.h)].some(v => (v || '').toLowerCase().includes(q)));
    $('#hl').innerHTML = `<div class="pad"><div class="label">${f.length} of ${H.length} HIRACs</div>` + (f.length ? `<div class="list">${f.map(h => {
      const max = Math.max(0, ...(h.hz || []).map(z => z.rpn || 0));
      return `<button class="lrow" data-go="hirac/${h.no}"><span class="av" style="border-radius:12px">${h.no}</span><span class="tx"><span class="a">${esc(h.title)}</span><span class="b">${(h.hz || []).length} hazards · Rev ${esc(h.rev ?? '-')}${h.owner ? ' · ' + esc(h.owner) : ''}</span></span><span class="rpn ${max >= 10 ? 'h' : max >= 5 ? 'm' : ''}">RPN ${max}</span></button>`; }).join('')}</div>` : '<div class="empty"><b>No match found</b></div>') + '</div>';
  };
  draw();
  let tm; $('#q').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { S.sopQuery = e.target.value.trim(); draw(); }, 200); };
}
async function viewHirac(no) {
  $('#app').innerHTML = `${bar(`HIRAC ${no}`, 'sop')}<main class="scroll" id="hd"><div class="spin">Loading…</div></main>`;
  let H; try { H = await hiracData(); } catch (e) { netErr(e); return; }
  const h = H.find(x => String(x.no) === String(no));
  if (!h) { $('#hd').innerHTML = '<div class="empty"><b>HIRAC not found</b></div>'; return; }
  const acts = h.acts && h.acts.length ? h.acts : [h.title];
  $('#hd').innerHTML = `<div class="dayhead"><div class="k">HIRAC ${h.no} · ${esc(h.ref || '')}</div><div class="v" style="font-size:22px;line-height:1.2">${esc(h.title)}</div></div>
    <div class="meta"><div><span class="k">Revision</span><span class="v">${esc(h.rev ?? '-')}</span></div><div><span class="k">Effective</span><span class="v">${h.eff ? fmtShort(fromYmd(h.eff)) : '-'}</span></div>
      <div><span class="k">Process owner</span><span class="v">${esc(h.owner || '-')}</span></div><div><span class="k">SOP ref.</span><span class="v" style="overflow-wrap:anywhere">${esc((h.sop || '-').replace(/^[,\s]+/, ''))}</span></div></div>
    <div style="padding:6px 12px 26px">${acts.map((a, ai) => { const hz = (h.hz || []).filter(z => (z.a || 0) === ai);
      return `<h2 class="clsec">${esc(a)}<span>${hz.length} hazard${hz.length === 1 ? '' : 's'}</span></h2>` + hz.map(z => `<div class="hz">
        <div class="h"><b>${esc(z.h)}</b><span class="rpn ${z.rpn >= 10 ? 'h' : z.rpn >= 5 ? 'm' : ''}">RPN ${z.rpn ?? '-'}</span></div>
        ${z.e ? `<div><div class="k">Possible injury</div><div class="c">${esc(z.e)}</div></div>` : ''}
        ${z.c ? `<div><div class="k">Control measures</div><div class="c">${esc(z.c)}</div></div>` : ''}
        ${z.g ? `<div><div class="k">Gaps</div><div class="c">${esc(z.g)}</div></div>` : ''}
        ${z.w ? `<div class="hint">Affected: ${esc(z.w)}</div>` : ''}</div>`).join(''); }).join('')}
      <p class="hint" style="text-align:center;margin-top:16px">From HSM Electrical HIRAC register</p></div>`;
}
async function sopDocs() {
  const b = $('#sbody'), admin = isModAdmin('sop'); S.docType = S.docType || 'All'; const KINDS = [['SOP', 'SOP'], ['HIRAC', 'HIRAC'], ['DOC', 'Documents']];
  b.innerHTML = `<div class="tabs" id="dt" style="border-top:1px solid var(--line)">${DOC_AREAS.map(a => `<button data-a="${a}" class="${a === S.docArea ? 'on' : ''}">${a}</button>`).join('')}</div>
    <div class="seg dtype" id="dty">${[['All', 'All'], ...KINDS].map(([k, l]) => `<button data-k="${k}" class="${S.docType === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <main class="scroll" id="dl" style="padding-bottom:90px"><div class="spin">Loading…</div></main>
    <label class="fab" style="cursor:pointer;bottom:24px">${ic('upload', 22)} Add document<input type="file" id="up" hidden accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"></label>`;
  $('#dt').onclick = e => { const x = e.target.closest('[data-a]'); if (!x) return; S.docArea = x.dataset.a; sopDocs(); };
  $('#dty').onclick = e => { const x = e.target.closest('[data-k]'); if (!x) return; S.docType = x.dataset.k; sopDocs(); };
  $('#up').onchange = async e => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    if (!DOC_OK.test(file.name)) return toast(DOC_NO, 6000);
    if (file.size > 50 * 1024 * 1024) return toast('File is larger than 50 MB');
    const area = await pickSheet('Add to which area?', esc(file.name), DOC_AREAS.map(a => [a, a]), S.docArea); if (!area) return;
    const kind = await pickSheet(`Add to ${area} – where?`, esc(file.name), [['SOP', 'SOP'], ['HIRAC', 'HIRAC'], ['DOC', 'Documents (other)']]); if (!kind) return;
    S.docArea = area; const kl = KINDS.find(k => k[0] === kind)[1];
    const path = `${S.docArea}/${kind}/${file.name.replace(/[\\/#?%]/g, '_')}`;
    toast('Uploading…', 20000);
    try { await storageUpload(path, file); logAct('sop', `${kl} document added`, `${S.docArea} · ${file.name}`); toast(`Added to ${S.docArea} · ${kl}`); sopDocs(); }
    catch (err) {
      if (err.exists && admin && await ask('Replace the existing file?', `${file.name} is already in ${S.docArea} / ${kl}.`, 'Replace')) {
        try { await storageUpload(path, file, SOP_BUCKET, true); logAct('sop', `${kl} document replaced`, `${S.docArea} · ${file.name}`); toast('Document replaced'); sopDocs(); } catch (e2) { netErr(e2); }
      } else if (err.exists) toast('A file with this name already exists'); else netErr(err);
    }
  };
  try {
    const ok = o => o.id && o.name !== '.emptyFolderPlaceholder';
    const [root, sop, hir, dc] = await Promise.all([storageList(`${S.docArea}/`), storageList(`${S.docArea}/SOP/`).catch(() => []), storageList(`${S.docArea}/HIRAC/`).catch(() => []), storageList(`${S.docArea}/DOC/`).catch(() => [])]);
    const all = [...root.filter(ok).map(o => ({ o, kind: 'SOP', path: `${S.docArea}/${o.name}` })), ...sop.filter(ok).map(o => ({ o, kind: 'SOP', path: `${S.docArea}/SOP/${o.name}` })),
      ...hir.filter(ok).map(o => ({ o, kind: 'HIRAC', path: `${S.docArea}/HIRAC/${o.name}` })), ...dc.filter(ok).map(o => ({ o, kind: 'DOC', path: `${S.docArea}/DOC/${o.name}` }))];
    const items = all.filter(x => S.docType === 'All' || x.kind === S.docType).sort((a, b) => a.o.name.localeCompare(b.o.name));
    const typ = n => (n.split('.').pop() || '').toUpperCase().slice(0, 4);
    const size = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
    const row = x => `<button class="lrow" data-p="${esc(x.path)}" style="${admin ? 'flex:1;min-width:0' : ''}"><span class="ic" style="font-size:12px;font-weight:800">${esc(typ(x.o.name))}</span><span class="tx"><span class="a" style="font-size:16px">${esc(x.o.name.replace(/\.[^.]+$/, ''))}</span><span class="b"><span class="dk ${x.kind}">${x.kind === 'DOC' ? 'DOCUMENT' : x.kind}</span>${x.o.metadata ? size(x.o.metadata.size) : ''}${x.o.updated_at ? ' · ' + fmtShort(new Date(x.o.updated_at)) : ''}</span></span>${admin ? '' : `<span class="chev">${ic('chev', 22)}</span>`}</button>`;
    $('#dl').innerHTML = items.length ? `<div class="pad"><div class="label">${items.length} document${items.length > 1 ? 's' : ''} · ${esc(S.docArea)}${S.docType !== 'All' ? ' · ' + (S.docType === 'DOC' ? 'Documents' : S.docType) : ''}</div><div class="list">${items.map(x => admin
        ? `<div style="display:flex;align-items:center">${row(x)}<button class="ib" data-del="${esc(x.path)}" aria-label="Delete ${esc(x.o.name)}" style="color:var(--red);margin-right:6px">${ic('trash', 22)}</button></div>` : row(x)).join('')}</div></div>`
      : `<div class="empty"><b>No ${S.docType === 'All' ? '' : (S.docType === 'DOC' ? '' : S.docType + ' ')}documents in ${esc(S.docArea)} yet</b>Tap “Add document” and choose where to add it.</div>`;
    $('#dl').onclick = async e => {
      const d = e.target.closest('[data-del]');
      if (d) { const name = d.dataset.del.split('/').pop();
        if (!(await ask('Delete this document?', `${name}\nIt is removed for everyone.`, 'Delete', 'Cancel', true))) return;
        try { await storageDelete(d.dataset.del, SOP_BUCKET); logAct('sop', 'Document deleted', `${S.docArea} · ${name}`); toast('Document deleted'); sopDocs(); } catch (err) { netErr(err); } return; }
      const r = e.target.closest('[data-p]'); if (!r) return;
      try { await openDoc(r.dataset.p, SOP_BUCKET); } catch (err) { netErr(err); } };
  } catch (e) { $('#dl').innerHTML = '<div class="empty"><b>Could not load documents</b></div>'; netErr(e); }
}

/* ================= DRIVE (PDF manuals, view only) ================= */
const DRIVE_BUCKET = 'drive-docs';
const DRIVE_BASE = [['ACPAR', 'ABB AC Drive Parameters'], ['DCPAR', 'ABB DC Drive Parameters'], ['GEFLT', 'GE Drive Fault Codes'], ['ACFLT', 'ABB AC Drive Fault Codes'], ['DCFLT', 'ABB DC Drive Fault Codes']];
let DRIVE_TABS = DRIVE_BASE;
const driveLabel = k => (DRIVE_TABS.find(t => t[0] === k) || [k, k])[1];
const fmtSize = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
const driveFiles = async tab => (await storageList(`${tab}/`, DRIVE_BUCKET)).filter(o => o.id && o.name && /\.pdf$/i.test(o.name));

async function viewDrive(tab) {
  const admin = isModAdmin('drive'), tabs = DRIVE_TABS.filter(([k]) => canArea('drive', k));
  if (tab && !tabs.some(t => t[0] === tab)) tab = '';
  $('#app').innerHTML = `${bar(tab ? driveLabel(tab) : 'Drive', tab ? 'drive' : 'home', logBtn('drive'))}<main class="scroll" id="dr" style="${admin ? 'padding-bottom:150px' : ''}"><div class="spin">Loading…</div></main>
    ${admin ? `<label class="fab" style="cursor:pointer;bottom:88px">${ic('upload', 22)} Add document<input type="file" id="dup" hidden multiple accept=".pdf,application/pdf"></label>` : ''}${nav('drive')}`;
  if (admin) $('#dup').onchange = async e => {
    const files = [...e.target.files]; e.target.value = ''; if (!files.length) return;
    if (files.some(f => !/\.pdf$/i.test(f.name))) return toast('Only PDF files can be added');
    if (files.some(f => f.size > 100 * 1024 * 1024)) return toast('A file is larger than 100 MB');
    const target = await pickSheet('Add to which tab?', files.map(f => esc(f.name)).join('<br>'), DRIVE_TABS.map(([k, l]) => [k, l]), tab);
    if (!target) return;
    let ok = 0;
    for (const f of files) {
      const path = `${target}/${f.name.replace(/[\\/#?%]/g, '_')}`;
      toast(`Uploading ${ok + 1} of ${files.length}…`, 120000);
      try { await storageUpload(path, f, DRIVE_BUCKET); ok++; logAct('drive', 'Document added', `${driveLabel(target)} · ${f.name}`); }
      catch (err) {
        if (err.exists && await ask('Replace the existing file?', `${f.name} is already in ${driveLabel(target)}.`, 'Replace')) {
          try { await storageUpload(path, f, DRIVE_BUCKET, true); ok++; logAct('drive', 'Document replaced', `${driveLabel(target)} · ${f.name}`); } catch (e2) { netErr(e2); }
        } else if (!err.exists) { netErr(err); break; }
      }
    }
    if (ok) toast(`${ok} document${ok > 1 ? 's' : ''} added to ${driveLabel(target)}`);
    viewDrive(tab);
  };
  if (!tabs.length) { $('#dr').innerHTML = `<div class="empty"><b>No Drive folders for you yet</b>Ask ${esc(ADMIN_NAME)} to give you access.</div>`; return; }
  if (!tab) {
    $('#dr').innerHTML = `<div class="pad"><div class="list">${tabs.map(([k, l]) => `<button class="lrow" data-t="${k}"><span class="ic">${ic('drive', 24)}</span><span class="tx"><span class="a" style="font-size:17px">${esc(l)}</span><span class="b" id="cnt-${k}">&nbsp;</span></span><span class="chev">${ic('chev', 22)}</span></button>`).join('')}</div>
      ${admin ? `<button class="btn block" id="dnf" style="margin-top:14px">${ic('folderplus', 22)} New folder</button>` : ''}
      <p class="hint" style="text-align:center;margin-top:14px">View only. Documents cannot be downloaded.</p></div>`;
    if (admin) $('#dnf').onclick = () => { const md = $('#modal');
      md.innerHTML = `<div class="sheet"><h3>New Drive folder</h3><div class="fld"><label for="dfn">Folder name</label><input id="dfn" maxlength="40" placeholder="e.g. Siemens drive manuals" autocomplete="off"></div>
        <p class="hint" style="margin:6px 0 12px">It appears as a new tab for you. To let others see it, tick it for them in Access.</p><div class="two"><button class="btn ghost" id="dfx">Cancel</button><button class="btn pri" id="dfs">Create</button></div></div>`;
      md.classList.remove('hidden'); md.onclick = e => { if (e.target === md) md.classList.add('hidden'); }; $('#dfn').focus();
      $('#dfx').onclick = () => md.classList.add('hidden');
      $('#dfs').onclick = async () => { const l = $('#dfn').value.trim().replace(/\s+/g, ' ');
        if (l.length < 2) return toast('Enter a folder name');
        if (DRIVE_TABS.some(t => t[1].toLowerCase() === l.toLowerCase())) return toast('A folder with this name already exists');
        const k = 'F' + Date.now().toString(36).toUpperCase(), cur = Array.isArray(SET.drive_folders) ? SET.drive_folders : [];
        $('#dfs').disabled = true;
        try { await saveSetting('drive_folders', [...cur, { k, l }]); logAct('drive', 'Folder created', l); md.classList.add('hidden'); toast('Folder created'); viewDrive(); } catch (e) { $('#dfs').disabled = false; netErr(e); } }; };
    $('#dr').onclick = e => { const b = e.target.closest('[data-t]'); if (b) location.hash = '#drive/' + b.dataset.t; };
    tabs.forEach(async ([k]) => { try { const n = (await driveFiles(k)).length; const el = $('#cnt-' + k); if (el) el.textContent = n ? `${n} document${n > 1 ? 's' : ''}` : 'No documents yet'; } catch (e) {} });
    return;
  }
  let items = [];
  try { items = await driveFiles(tab); } catch (e) { $('#dr').innerHTML = `<div class="empty"><b>Could not load documents</b>Check the network and try again.</div>`; netErr(e); return; }
  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const row = o => `<button class="lrow" data-f="${esc(tab + '/' + o.name)}" style="${admin ? 'flex:1;min-width:0' : ''}"><span class="ic" style="font-size:12px;font-weight:800">PDF</span><span class="tx"><span class="a" style="font-size:16px">${esc(o.name.replace(/\.[^.]+$/, ''))}</span><span class="b">${o.metadata ? fmtSize(o.metadata.size) : ''}${o.updated_at ? ' · ' + fmtShort(new Date(o.updated_at)) : ''}</span></span>${admin ? '' : `<span class="chev">${ic('chev', 22)}</span>`}</button>`;
  $('#dr').innerHTML = `<div class="pad"><div class="label">${items.length} document${items.length === 1 ? '' : 's'}</div>
    <div class="list">${items.length ? items.map(o => admin ? `<div style="display:flex;align-items:center">${row(o)}<button class="ib" data-del="${esc(tab + '/' + o.name)}" aria-label="Remove ${esc(o.name)}" style="color:var(--red);margin-right:6px">${ic('trash', 22)}</button></div>` : row(o)).join('')
      : `<div class="empty"><b>No documents in ${esc(driveLabel(tab))} yet</b>${admin ? 'Tap “Add document” to upload PDF files.' : ''}</div>`}</div></div>`;
  if (admin && !items.length && !DRIVE_BASE.some(t => t[0] === tab)) $('#dr').insertAdjacentHTML('beforeend', `<div class="pad"><button class="btn block" id="dfd" style="color:var(--red)">${ic('trash', 20)} Delete this empty folder</button></div>`);
  if ($('#dfd')) $('#dfd').onclick = async () => { const nm = driveLabel(tab); if (!(await ask('Delete this folder?', nm, 'Delete', 'Cancel', true))) return;
    try { await saveSetting('drive_folders', (SET.drive_folders || []).filter(f => f.k !== tab)); logAct('drive', 'Folder deleted', nm); toast('Folder deleted'); location.hash = '#drive'; } catch (e) { netErr(e); } };
  $('#dr').onclick = async e => {
    const d = e.target.closest('[data-del]');
    if (d) { const name = d.dataset.del.split('/').pop();
      if (!(await ask('Remove this document?', `${name}\nIt is removed for everyone.`, 'Remove', 'Cancel', true))) return;
      try { await storageDelete(d.dataset.del, DRIVE_BUCKET); logAct('drive', 'Document removed', `${driveLabel(tab)} · ${name}`); toast('Document removed'); viewDrive(tab); } catch (err) { netErr(err); } return; }
    const r = e.target.closest('[data-f]'); if (r) openDriveDoc(r.dataset.f);
  };
}

// In-app PDF reader: pages are drawn to canvas (no file, no download or print button), with text search + zoom.
async function openDriveDoc(path, bucket = DRIVE_BUCKET) {
  const name = path.split('/').pop();
  closeDoc();
  const v = document.createElement('div'); v.id = 'docv'; v.className = 'drv';
  v.innerHTML = `<header class="bar"><h1 style="font-size:17px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(name.replace(/\.[^.]+$/, ''))}</h1>
    <button class="ib" id="dv-s" aria-label="Search in document">${ic('search', 26)}</button><button class="ib" id="docx-close" aria-label="Close">${ic('x', 28)}</button></header>
    <div class="dvs hidden" id="dvs"><input id="dvq" type="search" placeholder="Search text in this document" autocomplete="off"><span id="dvc" class="dvc"></span>
      <button class="ib dvu" id="dvp" aria-label="Previous match">${ic('chev', 22)}</button><button class="ib dvd" id="dvn" aria-label="Next match">${ic('chev', 22)}</button></div>
    <div id="docb" class="dvb"><div class="spin">Opening…</div></div>
    <div class="dvz"><button class="ib" id="dvzo" aria-label="Zoom out">${ic('minus', 22)}</button><button class="ib" id="dvzi" aria-label="Zoom in">${ic('plus', 22)}</button></div>`;
  ['contextmenu', 'dragstart', 'copy', 'cut'].forEach(t => v.addEventListener(t, e => e.preventDefault()));
  document.body.appendChild(v); document.body.style.overflow = 'hidden';
  if (bucket === DRIVE_BUCKET && window.HSMNative && HSMNative.secure) { try { HSMNative.secure(true); } catch (e) {} }
  history.pushState({ docv: 1 }, '');
  $('#docx-close').onclick = () => history.back();
  const body = $('#docb'), live = () => document.body.contains(body);
  try {
    const url = await storageSignedUrl(path, bucket);
    const res = await fetch(url); if (!res.ok) throw new Error('Could not open document');
    const total = +res.headers.get('content-length') || 0; let buf;
    if (res.body && total) { const rd = res.body.getReader(), parts = []; let got = 0;
      for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; if (!live()) return; body.firstChild.textContent = `Opening… ${Math.round(got * 100 / total)}%`; }
      buf = new Uint8Array(got); let o = 0; parts.forEach(p => { buf.set(p, o); o += p.length; });
    } else buf = new Uint8Array(await res.arrayBuffer());
    if (!live()) return;
    await loadScript('lib/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise; if (!live()) return;
    body.innerHTML = '';
    const dpr = Math.min(window.devicePixelRatio || 1, 2), n = pdf.numPages;
    let zoom = 1, baseW = body.clientWidth - 16;
    const ratio = new Array(n).fill(0), wraps = [], tx = new Array(n).fill(null);
    const p1 = await pdf.getPage(1), v1 = p1.getViewport({ scale: 1 }); ratio.fill(v1.height / v1.width);
    for (let i = 0; i < n; i++) { const w = document.createElement('div'); w.className = 'dvp'; w.dataset.i = i; w.innerHTML = '<span class="dvn">' + (i + 1) + '</span>'; body.appendChild(w); wraps.push(w); }
    const size = () => wraps.forEach((w, i) => { w.style.width = baseW * zoom + 'px'; w.style.height = baseW * zoom * ratio[i] + 'px'; });
    const marks = { list: [], cur: -1 };
    const drawMarks = i => { const w = wraps[i]; let h = w.querySelector('.hl'); if (!h) { h = document.createElement('div'); h.className = 'hl'; w.appendChild(h); }
      h.innerHTML = marks.list.map((m, k) => m.page === i ? m.rects.map(r => `<i class="${k === marks.cur ? 'cur' : ''}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></i>`).join('') : '').join(''); };
    const renderPg = async i => {
      const w = wraps[i], key = zoom + ':' + baseW; if (w.dataset.r === key) return; w.dataset.r = key; const my = w._t = (w._t || 0) + 1;
      try {
        const pg = await pdf.getPage(i + 1), vp0 = pg.getViewport({ scale: 1 }); ratio[i] = vp0.height / vp0.width;
        const cssW = baseW * zoom, vp = pg.getViewport({ scale: cssW / vp0.width * dpr });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; c.className = 'pdfpg';
        await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        if (w._t !== my || !live()) return;
        const old = w.querySelector('canvas'); if (old) old.remove(); w.insertBefore(c, w.firstChild); w.style.height = cssW * ratio[i] + 'px'; drawMarks(i);
      } catch (e) { w.dataset.r = ''; }
    };
    const freePg = i => { const w = wraps[i]; w._t = (w._t || 0) + 1; w.dataset.r = ''; const c = w.querySelector('canvas'); if (c) { c.width = 0; c.remove(); } };
    const io = new IntersectionObserver(es => es.forEach(en => { const i = +en.target.dataset.i; if (en.isIntersecting) renderPg(i); else freePg(i); }), { root: body, rootMargin: '900px 0px' });
    size(); wraps.forEach(w => io.observe(w));
    const relayout = () => { const y = body.scrollTop / Math.max(1, body.scrollHeight); wraps.forEach((w, i) => { w.dataset.r = ''; w._t = (w._t || 0) + 1; }); size(); body.scrollTop = y * body.scrollHeight; io.disconnect(); wraps.forEach(w => io.observe(w)); };
    $('#dvzi').onclick = () => { if (zoom < 3) { zoom = Math.min(3, +(zoom + 0.5).toFixed(1)); relayout(); } };
    $('#dvzo').onclick = () => { if (zoom > 1) { zoom = Math.max(1, +(zoom - 0.5).toFixed(1)); relayout(); } };
    // ---- text search ----
    let ready = null, last = '';
    const extract = () => ready || (ready = (async () => {
      for (let i = 0; i < n; i++) {
        if (!live()) return;
        const pg = await pdf.getPage(i + 1), vp = pg.getViewport({ scale: 1 }), c = await pg.getTextContent(); let full = ''; const it = [];
        for (const t of c.items) { if (typeof t.str !== 'string') continue; const m = pdfjsLib.Util.transform(vp.transform, t.transform), fh = Math.hypot(m[2], m[3]) || t.height || 10;
          it.push({ s: full.length, l: t.str.length, x: m[4] / vp.width * 100, y: (m[5] - fh) / vp.height * 100, w: t.width / vp.width * 100, h: fh * 1.15 / vp.height * 100 }); full += t.str + ' '; }
        tx[i] = { full: full.toLowerCase(), it };
        if (i % 10 === 0) $('#dvc').textContent = `Reading ${i + 1}/${n}`;
      }
    })());
    const go = k => { if (!marks.list.length) return; const old = marks.cur; marks.cur = (k + marks.list.length) % marks.list.length;
      const m = marks.list[marks.cur]; [old >= 0 ? marks.list[old].page : -1, m.page].forEach(p => { if (p >= 0) drawMarks(p); });
      const w = wraps[m.page], r = m.rects[0]; body.scrollTo({ top: w.offsetTop + r[1] / 100 * w.offsetHeight - body.clientHeight / 3, behavior: 'smooth' });
      $('#dvc').textContent = `${marks.cur + 1} / ${marks.list.length}`; };
    const search = async () => {
      const q = $('#dvq').value.trim().toLowerCase().replace(/\s+/g, ' '); if (q === last) return; last = q;
      const prev = marks.list.map(m => m.page); marks.list = []; marks.cur = -1; [...new Set(prev)].forEach(drawMarks);
      if (q.length < 2) { $('#dvc').textContent = ''; return; }
      await extract(); if (!live() || last !== q) return;
      let any = 0;
      tx.forEach((t, i) => { if (!t) return; any += t.full.length; let p = 0;
        while ((p = t.full.indexOf(q, p)) >= 0) { const e = p + q.length, rects = [];
          t.it.forEach(x => { const a = Math.max(p, x.s), b = Math.min(e, x.s + x.l); if (a < b && x.l) rects.push([x.x + x.w * (a - x.s) / x.l, x.y, x.w * (b - a) / x.l, x.h]); });
          if (rects.length) marks.list.push({ page: i, rects }); p = e; } });
      new Set(marks.list.map(m => m.page)).forEach(drawMarks);
      if (!marks.list.length) { $('#dvc').textContent = any < n ? 'No text in this file (scanned)' : 'No match'; return; }
      go(0);
    };
    $('#dv-s').onclick = () => { const s = $('#dvs'); s.classList.toggle('hidden'); if (!s.classList.contains('hidden')) { $('#dvq').focus(); extract(); } };
    let tm; $('#dvq').oninput = () => { clearTimeout(tm); tm = setTimeout(search, 450); };
    $('#dvq').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); if ($('#dvq').value.trim().toLowerCase().replace(/\s+/g, ' ') === last && marks.list.length) go(marks.cur + 1); else search(); $('#dvq').blur(); } };
    $('#dvn').onclick = () => go(marks.cur + 1); $('#dvp').onclick = () => go(marks.cur - 1);
  } catch (e) { if (live()) body.innerHTML = `<div class="empty"><b>Could not open this document</b>${esc(isNet(e) ? 'Check the network and try again.' : e.message)}</div>`; }
}

/* ================= SOP's OF MILL PROCESS ================= */
async function viewMillProcessSops() {
  const admin = isModAdmin('mill');
  const areas = MILL_AREAS.filter(([f]) => canArea('mill', f));
  $('#app').innerHTML = `${bar('SOP\'s of Mill Process', 'home', logBtn('mill'))}<main class="scroll" id="ml" style="${admin ? 'padding-bottom:90px' : ''}"><div class="spin">Loading…</div></main>
    ${admin ? `<label class="fab" style="cursor:pointer;bottom:88px">${ic('upload', 22)} Add SOP<input type="file" id="mup" hidden accept=".docx,.pdf"></label>` : ''}${nav('mill')}`;
  const size = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
  if (!areas.length) { $('#ml').innerHTML = `<div class="empty"><b>No areas for you yet</b>Ask ${esc(ADMIN_NAME)} to give you access to your area's SOPs.</div>`; return; }
  if (!areas.some(a => a[0] === S.millArea)) S.millArea = areas[0][0];
  const label = f => (MILL_AREAS.find(a => a[0] === f) || [f, f])[1];
  const draw = async () => {
    const btns = `<div class="tabs milltabs" id="mt" role="tablist">${areas.map(([f, t]) => `<button role="tab" data-area="${f}" class="${S.millArea === f ? 'on' : ''}" aria-selected="${S.millArea === f}">${esc(t)}</button>`).join('')}</div>`;
    $('#ml').innerHTML = `${btns}<div class="pad"><div class="spin">Loading…</div></div>`;
    { const on = $('#mt .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }
    let items = [];
    try { items = (await storageList(`${S.millArea}/`, MILL_PROCESS_BUCKET)).filter(o => o.id && o.name && /\.(docx?|pdf)$/i.test(o.name)); }
    catch (e) { $('#ml').innerHTML = `${btns}<div class="pad"><div class="empty"><b>Could not load procedures</b>Check the network and try again.</div></div>`; netErr(e); return; }
    const typ = n => (n.split('.').pop() || '').toUpperCase().slice(0, 4);
    const row = o => `<button class="lrow" data-f="${esc(S.millArea + '/' + o.name)}" style="${admin ? 'flex:1;min-width:0' : ''}">
        <span class="ic" style="font-size:12px;font-weight:800">${esc(typ(o.name))}</span><span class="tx"><span class="a" style="font-size:16px">${esc(o.name.replace(/\.[^.]+$/, ''))}</span><span class="b">${o.metadata ? size(o.metadata.size) : ''}${o.updated_at ? ' · ' + fmtShort(new Date(o.updated_at)) : ''}</span></span>${admin ? '' : `<span class="chev">${ic('chev', 22)}</span>`}</button>`;
    $('#ml').innerHTML = `${btns}<div class="pad">
      <div class="label">${items.length} procedure${items.length === 1 ? '' : 's'} · ${esc(label(S.millArea))}</div>
      <div class="list">${items.length ? items.map(o => admin ? `<div style="display:flex;align-items:center">${row(o)}<button class="ib" data-del="${esc(S.millArea + '/' + o.name)}" aria-label="Delete ${esc(o.name)}" style="color:var(--ink-2);margin-right:6px">${ic('x', 22)}</button></div>` : row(o)).join('')
        : `<div class="empty"><b>No SOPs in ${esc(label(S.millArea))} yet</b>${admin ? 'Tap “Add SOP” to upload a Word or PDF file.' : ''}</div>`}</div></div>`;
  };
  $('#ml').onclick = async e => {
    const area = e.target.closest('[data-area]'); if (area) { S.millArea = area.dataset.area; draw(); return; }
    const d = e.target.closest('[data-del]');
    if (d) { const name = d.dataset.del.split('/').pop();
      if (!(await ask('Delete this SOP?', `${name}\nIt is removed for everyone.`, 'Delete', 'Cancel', true))) return;
      try { await storageDelete(d.dataset.del, MILL_PROCESS_BUCKET); logAct('mill', 'SOP deleted', `${label(S.millArea)} · ${name}`); toast('SOP deleted'); draw(); } catch (err) { netErr(err); } return; }
    const r = e.target.closest('[data-f]'); if (!r) return;
    try { await openDoc(r.dataset.f, MILL_PROCESS_BUCKET); } catch (err) { netErr(err); } };
  if ($('#mup')) $('#mup').onchange = async e => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    if (!/\.(docx|pdf)$/i.test(file.name)) return toast('Choose a Word (.docx) or PDF file');
    if (file.size > 50 * 1024 * 1024) return toast('File is larger than 50 MB');
    const area = await pickSheet('Add to which area?', esc(file.name), MILL_AREAS.map(([k, l]) => [k, l]), S.millArea); if (!area) return;
    S.millArea = area;
    const path = `${area}/${file.name.replace(/[\\/#?%]/g, '_')}`;
    toast('Uploading…', 60000);
    try { await storageUpload(path, file, MILL_PROCESS_BUCKET); logAct('mill', 'SOP added', `${label(S.millArea)} · ${file.name}`); toast('SOP added'); draw(); }
    catch (err) {
      if (err.exists && await ask('Replace the existing SOP?', `${file.name} is already in ${label(S.millArea)}.`, 'Replace')) {
        try { toast('Uploading…', 60000); await storageUpload(path, file, MILL_PROCESS_BUCKET, true); logAct('mill', 'SOP replaced', `${label(S.millArea)} · ${file.name}`); toast('SOP replaced'); draw(); } catch (e2) { netErr(e2); }
      } else if (!err.exists) netErr(err); else toast('Not uploaded');
    }
  };
  draw();
}

/* ================= ADMIN UPLOADS (Excel → cloud) ================= */
const xv = v => { if (v == null) return null; if (v instanceof Date) return v; if (typeof v === 'object') { if ('result' in v) return xv(v.result); if (v.richText) return v.richText.map(t => t.text).join(''); if ('text' in v) return v.text; if ('error' in v) return null; } return v; };
const xt = v => { v = xv(v); return v == null || v instanceof Date ? '' : String(v).replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); };
const cleanName = n => String(n || '').replace(/ /g, ' ').trim().replace(/^(mr|mrs|ms|miss)\.?\s+/i, '').replace(/\s+/g, ' ').trim()
  .split(' ').map(w => /^[A-Z]\.$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
const cleanArea = a => { a = String(a || '').trim(); if (!a) return ''; return a.length <= 3 || /\d/.test(a) ? a.toUpperCase() : a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(); };
async function readBook(file) { const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await file.arrayBuffer()); return wb; }
const ROSTER_CODES = { A: 'A', B: 'B', C: 'C', G: 'G', L: 'L', WO: 'WO', O: 'WO', OFF: 'WO', 'W/O': 'WO', 'W.O': 'WO', 'W.O.': 'WO', WOFF: 'WO', LEAVE: 'L', CL: 'L', SL: 'L', EL: 'L', PL: 'L', GEN: 'G', GENERAL: 'G' };
function parseRoster(ws) {
  const norm = c => xt(c).toUpperCase().replace(/[:\n]/g, ' ').replace(/\s+/g, ' ').trim();
  const isName = t => /^(NAME|EMPLOYEE NAME|EMP\.? NAME|FULL NAME|NAME OF (THE )?(EMPLOYEE|PERSON|ENGINEER|EMP\.?)|ENGINEER NAME)$/.test(t.replace(/\.$/, ''));
  const dayOf = v => { if (v instanceof Date) return v.getUTCDate(); if (typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 31) return v;
    const m = /^0?(\d{1,2})(ST|ND|RD|TH)?$/i.exec(String(v == null ? '' : v).trim()); const n = m ? +m[1] : 0; return n >= 1 && n <= 31 ? n : 0; };
  let hr = 0; for (let i = 1; i <= Math.min(ws.rowCount, 20) && !hr; i++) ws.getRow(i).eachCell(c => { if (isName(norm(c.value))) hr = i; });
  if (!hr) return null;
  const cols = { days: {} };
  ws.getRow(hr).eachCell((c, ci) => { const v = xv(c.value), t = norm(c.value), d = dayOf(v);
    if (d && !isName(t)) cols.days[ci] = d;
    else if (isName(t)) { if (!cols.name) cols.name = ci; } else if (t.startsWith('SAP') || /^(EMP(LOYEE)? ?(ID|NO|CODE)|PERS(ONNEL)? ?(NO|ID)|TICKET)/.test(t)) cols.sap = ci; else if (t === 'AREA' || t === 'SECTION' || t === 'DEPARTMENT' || t === 'DEPT') cols.area = ci; else if (t.startsWith('RANK')) cols.rank = ci; });
  if (!cols.name || Object.keys(cols.days).length < 28) return null;
  let month = null; for (let i = 1; i <= hr && !month; i++) ws.getRow(i).eachCell(c => { const v = xv(c.value); if (!month && v instanceof Date) month = v; });
  const people = [], bad = {};
  for (let i = hr + 1; i <= ws.rowCount; i++) {
    const row = ws.getRow(i), name = cleanName(xt(row.getCell(cols.name).value)); if (!name || /^\d+$/.test(name) || /^(name|sr\.? ?no)$/i.test(name)) continue;
    const shifts = {};
    for (const [ci, d] of Object.entries(cols.days)) { let sh = xt(row.getCell(+ci).value).toUpperCase().replace(/\s+/g, ''); if (!sh) continue;
      if (/^(MON|TUE|WED|THU|FRI|SAT|SUN)/.test(sh)) continue; sh = ROSTER_CODES[sh] || sh; if (!['A', 'B', 'C', 'G', 'L', 'WO'].includes(sh)) { bad[sh] = (bad[sh] || 0) + 1; continue; } shifts[d] = sh; }
    if (!Object.keys(shifts).length) continue;
    people.push({ name, sap_id: cols.sap ? xt(row.getCell(cols.sap).value).replace(/\.0$/, '') : '', area: cols.area ? cleanArea(xt(row.getCell(cols.area).value)) : '',
      ranking: cols.rank ? (parseInt(xt(row.getCell(cols.rank).value), 10) || null) : null, shifts });
  }
  return people.length ? { people, month, bad, maxDay: Math.max(...Object.values(cols.days)) } : null;
}
function parseTeam(ws) {
  let hr = 0, cols = {};
  for (let i = 1; i <= Math.min(ws.rowCount, 10) && !hr; i++) { const m = {};
    ws.getRow(i).eachCell((c, ci) => { const t = xt(c.value).toLowerCase().replace(/[^a-z]/g, '');
      if (t === 'fullname' || (t === 'name' && !m.name)) m.name = ci; else if (t.startsWith('sap')) m.sap = ci; else if (t === 'plant') m.plant = ci;
      else if (t === 'role' || t === 'company') m.company = ci; else if (t.includes('mobile') || t === 'phone') m.mobile = ci; else if (t.includes('email')) m.email = ci; });
    if (m.name && (m.mobile || m.email || m.sap)) { hr = i; cols = m; } }
  if (!hr) return null;
  const rows = [];
  for (let i = hr + 1; i <= ws.rowCount; i++) { const r = ws.getRow(i), g = k => cols[k] ? xt(r.getCell(cols[k]).value) : '';
    const name = cleanName(g('name')); if (!name) continue; const sap = g('sap').replace(/\.0$/, '');
    rows.push({ name, sap_id: /^n\/?a$/i.test(sap) ? '' : sap, plant: g('plant').toUpperCase(), company: g('company'), mobile: g('mobile').replace(/\.0$/, ''), email: g('email').replace(/,/g, '.') }); }
  return rows.length ? rows : null;
}
function parseContacts(ws) {
  let hr = 0, cols = {};
  for (let i = 1; i <= Math.min(ws.rowCount, 10) && !hr; i++) { const m = {};
    ws.getRow(i).eachCell((c, ci) => { const t = xt(c.value).toLowerCase().replace(/[^a-z0-9#]/g, '');
      if (t === 'detail' || t === 'details' || t === 'name') m.detail = ci; else if (/^ext/.test(t)) (m.ext1 ? (m.ext2 = m.ext2 || ci) : (m.ext1 = ci));
      else if (/^mob/.test(t)) (m.mob1 ? (m.mob2 = m.mob2 || ci) : (m.mob1 = ci)); else if (/^sr/.test(t)) m.sr = ci; });
    if (m.detail && (m.ext1 || m.mob1)) { hr = i; cols = m; } }
  if (!hr) return null;
  const rows = [], clean = v => { v = xt(v).replace(/\.0$/, ''); return v === '-' ? '' : v; };
  for (let i = hr + 1; i <= ws.rowCount; i++) { const r = ws.getRow(i), g = k => cols[k] ? clean(r.getCell(cols[k]).value) : '';
    const detail = g('detail'); if (!detail) continue;
    rows.push({ sr: parseInt(g('sr'), 10) || rows.length + 1, detail, ext1: g('ext1'), ext2: g('ext2'), mob1: g('mob1'), mob2: g('mob2') }); }
  return rows.length ? rows : null;
}
const TBT_NAMES = { SHIFT: 'Shift Group', INST: 'Instrument', RHF_RM: 'RM-RHF', CB_FM: 'CB-FM', COILER: 'Coiler', 'MD MOTOR': 'MD Motor', POWER: 'Power', CRANE: 'Crane' };
function parseTbt(wb) {
  const out = [];
  wb.worksheets.forEach((ws, si) => {
    const area = TBT_NAMES[ws.name.trim().toUpperCase()] || ws.name.trim(); let cur = null;
    for (let i = 1; i <= ws.rowCount; i++) {
      const row = ws.getRow(i), bc = row.getCell(2), c = xt(row.getCell(3).value);
      const b = bc.isMerged && bc.master && bc.master.address !== bc.address ? null : xv(bc.value);   // Sr No. is merged down over the points
      if (!c || (typeof b === 'string' && /^sr/i.test(b.trim()))) continue;
      if (typeof b === 'number') { cur = { area, area_sort: si + 1, sr: b, topic: c.replace(/[:\-\s]+$/, ''), points: [] }; out.push(cur); }
      else if (cur) String(xv(row.getCell(3).value) || '').replace(/\u00a0/g, ' ').split('\n').map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean).forEach(x => cur.points.push(x));
    }
  });
  return out.length ? out : null;
}
const upCard = (icon, title, hint, input) => `<div class="card" style="padding:16px;margin-bottom:14px"><div style="display:flex;gap:12px;align-items:center"><span class="ic">${ic(icon, 24)}</span><div><div style="font-size:18px;font-weight:700">${title}</div><div class="hint">${hint}</div></div></div>
      <label class="btn block" style="margin-top:12px;cursor:pointer">${ic('upload')} Choose Excel file<input type="file" id="${input}" hidden accept=".xlsx"></label></div>`;
function viewAdmin() {
  if (!ME.is_admin && !ADMIN_UPLOAD_MODS.some(isModAdmin)) return go('home');
  $('#app').innerHTML = `${bar('Admin uploads', 'profile')}<main class="scroll"><div class="pad">
    ${isModAdmin('schedule') ? upCard('cal', 'Shift schedule', 'Any Excel layout works if one header row has a NAME column and day columns 1–31; SAP ID, Area, Rank are optional. Each row is matched to the person by name. Shift codes: A, B, C, G, L, WO (O / OFF also accepted). Replaces that month for everyone. Single changes: Schedule → pick a date → Edit.', 'xr') : ''}
    ${isModAdmin('team') ? upCard('users', 'Team list', 'Team Members Excel (Full Name, SAP ID, Role, Mobile, Email, Plant). Replaces the whole Team list.', 'xtm') : ''}
    ${isModAdmin('contacts') ? upCard('phone', 'Contacts', 'AMNS Phone Numbers Excel (Detail, Ext#1, Ext#2, Mobile#1, Mobile#2). Replaces the whole list.', 'xct') : ''}
    ${isModAdmin('tbt') ? upCard('talk', 'TBT – HSM Electrical', 'TBT Excel: one sheet per area, Sr No. + topic, then the points below it. Replaces all TBTs.', 'xtb') : ''}
    ${isModAdmin('mill') ? `<div class="card" style="padding:16px"><div style="display:flex;gap:12px;align-items:center"><span class="ic">${ic('doc', 24)}</span><div><div style="font-size:18px;font-weight:700">SOP's of Mill Process</div><div class="hint">Open an area and tap “Add SOP” (Word or PDF). Tap ✕ next to a SOP to delete it.</div></div></div>
      <button class="btn block" data-go="mill" style="margin-top:12px">${ic('chev')} Open SOP's of Mill Process</button></div>` : ''}
    <div id="xprev"></div><div style="height:30px"></div></div></main>`;
  const prev = $('#xprev');
  const simpleUpload = (inputId, parse, label, fn, summary) => { const el = $('#' + inputId); if (!el) return;
    el.onchange = async e => {
      const f = e.target.files[0]; e.target.value = ''; if (!f) return;
      let wb; try { toast('Reading Excel…'); wb = await readBook(f); } catch (err) { return toast('Could not read this Excel file'); }
      const rows = parse(wb); if (!rows) return toast(`No ${label} found in this file`);
      prev.innerHTML = `<div class="card" style="padding:16px;margin-top:16px;border:2px solid var(--red)"><div class="label" style="margin:0 0 10px">Check before uploading</div>${summary(rows)}
        <div class="two" style="margin-top:12px"><button class="btn ghost" id="xno">Cancel</button><button class="btn pri" id="xgo">${ic('upload')} Upload</button></div></div>`;
      $('#xno').onclick = () => { prev.innerHTML = ''; };
      $('#xgo').onclick = async () => {
        if (!(await ask(`Replace ${label}?`, `${rows.length} rows. Everyone sees the new list at once.`, 'Upload'))) return;
        $('#xgo').disabled = true;
        try { const n = await rpc(fn, { p_rows: rows }); logAct(fn.includes('contacts') ? 'contacts' : 'tbt', `${label} uploaded`, `${rows.length} rows`); toast(`${label} uploaded (${n})`); prev.innerHTML = ''; }
        catch (err) { netErr(err); $('#xgo').disabled = false; } };
      prev.scrollIntoView({ behavior: 'smooth' });
    }; };
  simpleUpload('xct', wb => wb.worksheets.map(parseContacts).find(Boolean), 'the contacts', 'hsm_upload_contacts',
    rows => `<div style="font-size:16px"><b>${rows.length} contacts</b></div><div class="hint" style="margin-top:4px">First: ${rows.slice(0, 3).map(r => esc(r.detail)).join(', ')}…</div>`);
  simpleUpload('xtb', parseTbt, 'the TBTs', 'hsm_upload_tbt',
    rows => { const by = {}; rows.forEach(r => by[r.area] = (by[r.area] || 0) + 1);
      return `<div style="font-size:16px"><b>${rows.length} topics</b> · ${rows.reduce((n, r) => n + r.points.length, 0)} points</div><div class="hint" style="margin-top:4px">${Object.entries(by).map(([a, n]) => `${esc(a)} ${n}`).join(' · ')}</div>`; });
  if ($('#xr')) $('#xr').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    let wb; try { toast('Reading Excel…'); wb = await readBook(f); } catch (err) { return toast('Could not read this Excel file'); }
    const sheets = wb.worksheets.map(ws => ({ ws, r: parseRoster(ws) })).filter(x => x.r);
    if (!sheets.length) return toast('No shift schedule found. The sheet needs a NAME column and day columns 1–31 (see the format shown on this screen).');
    const show = k => {
      const { ws, r } = sheets[k];
      const m = r.month || new Date(); const mv = `${m.getUTCFullYear()}-${String(m.getUTCMonth() + 1).padStart(2, '0')}`;
      prev.innerHTML = `<div class="card" style="padding:16px;margin-top:16px;border:2px solid var(--red)"><div class="label" style="margin:0 0 10px">Check before uploading</div>
        ${sheets.length > 1 ? `<div class="fld" style="margin-bottom:10px"><label for="xsh">Sheet</label><select id="xsh">${sheets.map((x, i) => `<option value="${i}" ${i === k ? 'selected' : ''}>${esc(x.ws.name)}</option>`).join('')}</select></div>` : ''}
        <div class="fld" style="margin-bottom:10px"><label for="xmo">Month</label><input type="month" id="xmo" value="${mv}"></div>
        <div id="xsum"></div>
        <div class="two" style="margin-top:12px"><button class="btn ghost" id="xno">Cancel</button><button class="btn pri" id="xgo">${ic('upload')} Upload</button></div></div>`;
      const sum = () => { const [y, mo] = $('#xmo').value.split('-').map(Number); const dim = new Date(y, mo, 0).getDate();
        const rows = []; r.people.forEach(p => Object.entries(p.shifts).forEach(([d, sh]) => { if (+d <= dim) rows.push({ day: `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`, name: p.name, sap_id: p.sap_id, shift: sh, area: p.area, ranking: p.ranking }); }));
        const c = rows.filter(x => x.day.endsWith('-01')).reduce((a, x) => (a[x.shift] = (a[x.shift] || 0) + 1, a), {});
        const warn = [r.maxDay < dim ? `Only days 1–${r.maxDay} are in the sheet; ${r.maxDay + 1 === dim ? `day ${dim}` : `days ${r.maxDay + 1}–${dim}`} will be empty.` : '',
          Object.keys(r.bad).length ? `Skipped unknown codes: ${Object.entries(r.bad).map(([k2, n]) => `${esc(k2)} ×${n}`).join(', ')}` : '',
          r.people.some(p => !p.sap_id) ? `${r.people.filter(p => !p.sap_id).length} people have no SAP ID.` : ''].filter(Boolean);
        $('#xsum').innerHTML = `<div style="font-size:16px"><b>${r.people.length} people</b> · ${rows.length} shift entries · ${MONTHS[mo - 1]} ${y}</div>
          <div class="hint" style="margin-top:4px">Day 1: ${['A', 'B', 'C', 'G', 'L', 'WO'].map(k2 => `${k2} ${c[k2] || 0}`).join(' · ')}</div>
          ${warn.map(w => `<div class="hint" style="color:var(--amber);margin-top:6px">⚠ ${w}</div>`).join('')}`;
        return { rows, month: `${y}-${String(mo).padStart(2, '0')}-01`, label: `${MONTHS[mo - 1]} ${y}` }; };
      sum();
      $('#xmo').onchange = sum; if ($('#xsh')) $('#xsh').onchange = e2 => show(+e2.target.value);
      $('#xno').onclick = () => { prev.innerHTML = ''; };
      $('#xgo').onclick = async () => { const d = sum();
        if (!(await ask(`Replace the ${d.label} schedule?`, `${d.rows.length} entries from “${ws.name}”. Everyone sees the new schedule at once.`, 'Upload'))) return;
        $('#xgo').disabled = true;
        try { const n = await rpc('hsm_upload_roster', { p_month: d.month, p_rows: d.rows }); logAct('schedule', 'Monthly schedule uploaded', `${d.label} · ${n} entries`); toast(`${d.label} schedule uploaded (${n} entries)`); prev.innerHTML = ''; }
        catch (err) { netErr(err); $('#xgo').disabled = false; } };
      prev.scrollIntoView({ behavior: 'smooth' });
    };
    show(0);
  };
  if ($('#xtm')) $('#xtm').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    let wb; try { toast('Reading Excel…'); wb = await readBook(f); } catch (err) { return toast('Could not read this Excel file'); }
    const hit = wb.worksheets.map(ws => ({ ws, rows: parseTeam(ws) })).find(x => x.rows);
    if (!hit) return toast('No team list found. The sheet needs a Full Name column with Mobile, Email or SAP ID.');
    const rows = hit.rows;
    prev.innerHTML = `<div class="card" style="padding:16px;margin-top:16px;border:2px solid var(--red)"><div class="label" style="margin:0 0 10px">Check before uploading</div>
      <div style="font-size:16px"><b>${rows.length} members</b> from sheet “${esc(hit.ws.name)}”</div>
      <div class="hint" style="margin-top:4px">${rows.filter(r => r.sap_id).length} with SAP ID · ${rows.filter(r => r.mobile).length} with mobile · ${rows.filter(r => r.email).length} with e-mail</div>
      <div class="hint" style="margin-top:4px">First: ${rows.slice(0, 3).map(r => esc(r.name)).join(', ')}…</div>
      <div class="hint" style="margin-top:6px">Area comes from the latest shift schedule (matched by SAP ID).</div>
      <div class="two" style="margin-top:12px"><button class="btn ghost" id="xno">Cancel</button><button class="btn pri" id="xgo">${ic('upload')} Upload</button></div></div>`;
    $('#xno').onclick = () => { prev.innerHTML = ''; };
    $('#xgo').onclick = async () => {
      if (!(await ask('Replace the Team list?', `${rows.length} members. Everyone sees the new list at once.`, 'Upload'))) return;
      $('#xgo').disabled = true;
      try { const n = await rpc('hsm_upload_team', { p_rows: rows }); TEAM = null; logAct('team', 'Team list uploaded', `${n} members`); toast(`Team list uploaded (${n} members)`); prev.innerHTML = ''; }
      catch (err) { netErr(err); $('#xgo').disabled = false; } };
    prev.scrollIntoView({ behavior: 'smooth' });
  };
}

/* ================= TEAM ================= */
async function viewTeam() {
  $('#app').innerHTML = `${bar('Team', 'home', logBtn('team'))}
  <div class="searchwrap"><div class="search">${ic('search', 22)}<input id="tq" type="search" placeholder="Search name, area, SAP ID, mobile" aria-label="Search team" value="${esc(S.teamQuery)}"></div></div>
  <main class="scroll" id="tl"><div class="spin">Loading…</div></main>`;
  let rows = [], today = [];
  let pics = [];
  try { [rows, today, pics] = await Promise.all([team(), can('schedule') ? api(`shift_roster?select=name,shift&day=eq.${ymd(new Date())}`) : [], avatars()]); } catch (e) { netErr(e); }
  const photoOf = r => ((r.sap_id && pics.find(p => p.sap_id === r.sap_id)) || pics.find(p => sameName(p.full_name, r.name)) || {}).avatar_url;
  const shiftOf = n => (today.find(r => r.name === n) || today.find(r => sameName(r.name, n)) || {}).shift;
  const tagOf = s => !s ? '' : s === 'WO' ? '<span class="tag">Off</span>' : s === 'L' ? '<span class="tag amber">Leave</span>' : s === 'G' ? '<span class="tag">G</span>' : `<span class="tag red">${s}</span>`;
  const link = (href, icon, txt) => `<a href="${href}" style="display:inline-flex;align-items:center;gap:6px;margin:4px 14px 0 0;color:var(--red, #C8102E);font-weight:600;text-decoration:none">${ic(icon, 18)}${esc(txt)}</a>`;
  const canEdit = isModAdmin('team');
  const draw = () => {
    const q = S.teamQuery.toLowerCase();
    const f = rows.filter(r => !q || [r.name, r.area, r.company, r.mobile, r.sap_id, r.email].some(v => (v || '').toLowerCase().includes(q)));
    $('#tl').innerHTML = `<div class="pad"><div class="label">${f.length} members · today's shift shown</div><div class="list">` + f.map(r => {
      const sub = [r.area === 'Shift' ? 'Shift crew' : r.area, r.company, r.plant].filter(Boolean).join(' · ') || 'E&A';
      const det = [r.sap_id ? `<span class="hint" style="margin-top:4px">SAP ID: <b style="color:var(--ink)">${esc(r.sap_id)}</b></span>` : '',
        r.mobile ? link('tel:' + r.mobile.replace(/[^0-9+]/g, ''), 'phone', r.mobile) : '',
        r.email ? link('mailto:' + r.email, 'mail', r.email) : ''].filter(Boolean).join('');
      const ph = photoOf(r);
      return `<div class="lrow" style="flex-wrap:wrap;align-items:flex-start">${ph ? `<button class="phbtn" data-ph="${esc(ph)}" data-nm="${esc(r.name)}" aria-label="Photo of ${esc(r.name)}">${avHtml(ph, r.name)}</button>` : avHtml(ph, r.name)}<span class="tx"><span class="a">${esc(r.name)}</span><span class="b">${esc(sub)}</span>${canEdit ? `<button class="linkbtn" data-area="${r.id}" style="align-self:flex-start;margin-top:4px">${ic('edit', 18)} Change area</button>` : ''}${det ? `<span style="display:flex;flex-direction:column;align-items:flex-start;margin-top:2px;overflow-wrap:anywhere">${det}</span>` : ''}</span>${tagOf(shiftOf(r.name))}</div>`;
    }).join('') + '</div></div>';
  };
  draw();
  $('#tq').oninput = e => { S.teamQuery = e.target.value.trim(); draw(); };
  $('#tl').onclick = e => { const b = e.target.closest('[data-ph]'); if (b) return showPhoto(b.dataset.ph, b.dataset.nm);
    const a = e.target.closest('[data-area]'); if (!a) return; const r = rows.find(x => String(x.id) === a.dataset.area); if (!r) return;
    const areas = [...new Set([...rows.map(x => x.area), 'Shift', 'Instrument', 'Power', 'FM', 'RM', 'DC', 'Crane', 'Drive', 'L1', 'Motor', 'Planning'].filter(Boolean))];
    const m = $('#modal');
    m.innerHTML = `<div class="sheet" onclick="event.stopPropagation()"><h3>Change area</h3><p>${esc(r.name)} · now: <b>${esc(r.area || 'not set')}</b></p>
      <div class="fld"><label for="ar-in">New area (pick or type)</label><input id="ar-in" list="ar-dl" value="" placeholder="${esc(r.area || 'e.g. Instrument')}" autocomplete="off"><datalist id="ar-dl">${areas.map(x => `<option value="${esc(x)}">`).join('')}</datalist></div>
      <p class="hint">Applies from today onwards in the shift schedule too.</p>
      <div class="two"><button class="btn ghost" id="ar-x">Cancel</button><button class="btn pri" id="ar-ok">Save</button></div></div>`;
    m.classList.remove('hidden'); m.onclick = null; $('#ar-x').onclick = () => m.classList.add('hidden');
    $('#ar-ok').onclick = async () => { const v = $('#ar-in').value.trim(); if (!v) return toast('Type or pick the new area'); $('#ar-ok').disabled = true;
      try { await rpc('hsm_set_area', { p_id: r.id, p_area: v }); r.area = v || null; TEAM = null; m.classList.add('hidden'); toast(`${r.name}: area ${v || 'cleared'}`); draw(); }
      catch (err) { netErr(err); $('#ar-ok').disabled = false; } };
  };
}

/* ================= CONTACTS (AMNS phone numbers) ================= */
async function viewContacts() {
  $('#app').innerHTML = `${bar('Contacts', 'home', logBtn('contacts'))}
  <div class="searchwrap"><div class="search">${ic('search', 22)}<input id="cq" type="search" placeholder="Search name or number" aria-label="Search contacts" value="${esc(S.contactQuery)}"></div></div>
  <main class="scroll" id="ctl"><div class="spin">Loading…</div></main>`;
  let rows = [];
  try { rows = await api('contacts?select=sr,detail,ext1,ext2,mob1,mob2&order=sr'); } catch (e) { netErr(e); $('#ctl').innerHTML = '<div class="empty"><b>Could not load contacts</b></div>'; return; }
  const tel = n => String(n || '').replace(/[^0-9+]/g, '');
  // same four columns as the Excel sheet; a dash where the sheet has none; mobile numbers can be tapped to call
  const val = (label, v) => { const d = tel(v), mob = d.length >= 10;
    return `<span class="cv"><span class="k">${label}</span>${!v ? '<span class="v none">-</span>' : mob ? `<a href="tel:${d}" class="v call">${ic('phone', 16)}${esc(v)}</a>` : `<span class="v">${esc(v)}</span>`}</span>`; };
  const draw = () => {
    const q = S.contactQuery.toLowerCase();
    const f = rows.filter(r => !q || [r.detail, r.ext1, r.ext2, r.mob1, r.mob2].some(v => (v || '').toLowerCase().includes(q)));
    $('#ctl').innerHTML = `<div class="pad"><div class="label">${f.length} of ${rows.length} contacts · tap a mobile number to call</div>` + (f.length ? `<div class="list">${f.map(r => `<div class="lrow ctrow">
      <span class="av" style="border-radius:12px;font-size:15px">${r.sr || ''}</span><span class="tx"><span class="a">${esc(r.detail)}</span>
      <span class="cvs">${val('Ext#1', r.ext1)}${val('Ext#2', r.ext2)}${val('Mobile#1', r.mob1)}${val('Mobile#2', r.mob2)}</span></span></div>`).join('')}</div>`
      : '<div class="empty"><b>No match found</b></div>') + '</div>';
  };
  draw();
  $('#cq').oninput = e => { S.contactQuery = e.target.value.trim(); draw(); };
}

/* ================= TBT – HSM ELECTRICAL (tool box talks) ================= */
async function viewTbt() {
  $('#app').innerHTML = `${bar('TBT – HSM Electrical', 'home', logBtn('tbt'))}
  <div class="searchwrap"><div class="search">${ic('search', 22)}<input id="bq" type="search" placeholder="Search topic or point" aria-label="Search TBT" value="${esc(S.tbtQuery)}"></div></div>
  <div class="tabs" id="btabs" role="tablist"></div>
  <main class="scroll" id="btl"><div class="spin">Loading…</div></main>`;
  let rows = [];
  try { rows = await api('tbt?select=area,area_sort,sr,topic,points&order=area_sort,sr'); } catch (e) { netErr(e); $('#btl').innerHTML = '<div class="empty"><b>Could not load TBT</b></div>'; return; }
  if (!rows.length) { $('#btl').innerHTML = '<div class="empty"><b>No TBT uploaded yet</b></div>'; return; }
  const areas = [...new Set(rows.map(r => r.area))];
  if (!areas.includes(S.tbtArea)) S.tbtArea = areas[0];
  const shareText = r => `*TBT – ${r.area}*\n*${r.sr}. ${r.topic}*\n${(r.points || []).join('\n')}\n\n– HSM E&A`;
  const draw = () => {
    const q = S.tbtQuery.toLowerCase();
    $('#btabs').innerHTML = areas.map(a => `<button role="tab" data-a="${esc(a)}" class="${!q && a === S.tbtArea ? 'on' : ''}">${esc(a)}</button>`).join('');
    const f = rows.filter(r => q ? [r.topic, ...(r.points || [])].some(v => (v || '').toLowerCase().includes(q)) : r.area === S.tbtArea);
    $('#btl').innerHTML = `<div class="pad"><div class="label">${q ? `${f.length} topic${f.length === 1 ? '' : 's'} found` : `Tool Box Talk · ${esc(S.tbtArea)} · Safety precautions &amp; work instructions`}</div>` + (f.length ? f.map((r, i) => `<div class="card tbtc">
      <div class="tbth"><span class="no">${r.sr}</span><b>${esc(r.topic)}</b>${q ? `<span class="tag">${esc(r.area)}</span>` : ''}</div>
      ${(r.points || []).length ? `<ul>${r.points.map(p => `<li>${esc(p.replace(/^\d+\.\s*/, ''))}</li>`).join('')}</ul>` : ''}
      <button class="linkbtn" data-sh="${rows.indexOf(r)}">${ic('wa', 18)} Share on WhatsApp</button></div>`).join('') : '<div class="empty"><b>No match found</b></div>') + '</div>';
    const on = $('#btabs .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  };
  draw();
  $('#btabs').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; S.tbtArea = b.dataset.a; S.tbtQuery = ''; $('#bq').value = ''; draw(); $('#btl').scrollTo(0, 0); };
  $('#bq').oninput = e => { S.tbtQuery = e.target.value.trim(); draw(); };
  $('#btl').onclick = e => { const b = e.target.closest('[data-sh]'); if (!b) return; openLink('https://wa.me/?text=' + encodeURIComponent(shareText(rows[+b.dataset.sh]))); };
}

/* ================= SUGGESTIONS ================= */
const SUG_MODULES = [...MODULES.map(m => m[1].replace(/&amp;/g, '&')), 'Whole app', 'New module idea'];
async function viewSuggest() {
  const admin = !!ME.is_admin;
  if (!S.sugTab) S.sugTab = admin ? 'inbox' : 'new';
  $('#app').innerHTML = `${bar('Suggestions', 'home')}
    ${admin ? `<div class="seg" id="sgseg">${[['inbox','Inbox'],['new','Send']].map(([k, l]) => `<button data-t="${k}" class="${S.sugTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>` : ''}
    <main class="scroll" id="sg"><div class="spin">Loading…</div></main>${nav('suggest')}`;
  if ($('#sgseg')) $('#sgseg').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { S.sugTab = b.dataset.t; viewSuggest(); } };
  let rows = [];
  try { rows = await api(`suggestions?select=*&order=created_at.desc&limit=200`); } catch (e) { if (!isNet(e)) netErr(e); }
  const stTag = st => st === 'done' ? '<span class="tag green">Done</span>' : st === 'seen' ? '<span class="tag">Seen</span>' : '<span class="tag amber">New</span>';
  const card = (r, act) => `<div class="card sugc"><div class="sgh"><b>${esc(r.module)}</b>${stTag(r.status)}</div><div class="sgd">${esc(r.description)}</div>
    <div class="hint">${esc(r.name)}${r.sap_id ? ' · SAP ' + esc(r.sap_id) : ''}${r.area ? ' · ' + esc(r.area) : ''} · ${fmtStamp(r.created_at)}</div>
    ${act ? `<div class="two" style="margin-top:10px">${r.status === 'new' ? `<button class="btn sm" data-st="seen" data-id="${r.id}">${ic('ok', 18)} Mark seen</button>` : '<span></span>'}${r.status !== 'done' ? `<button class="btn sm green" data-st="done" data-id="${r.id}">${ic('ok', 18)} Done</button>` : ''}</div>` : ''}</div>`;
  if (admin && S.sugTab === 'inbox') {
    const n = rows.filter(r => r.status === 'new').length;
    $('#sg').innerHTML = `<div class="pad"><div class="label">${rows.length} suggestion${rows.length === 1 ? '' : 's'}${n ? ` · ${n} new` : ''}</div>${rows.length ? rows.map(r => card(r, true)).join('') : '<div class="empty"><b>No suggestions yet</b>What the team sends appears here.</div>'}</div>`;
    $('#sg').onclick = async e => { const b = e.target.closest('[data-st]'); if (!b) return; b.disabled = true;
      try { await api(`suggestions?id=eq.${b.dataset.id}`, { method: 'PATCH', body: { status: b.dataset.st }, prefer: 'return=minimal' }); logAct('suggest', 'Suggestion marked ' + b.dataset.st, 'id ' + b.dataset.id); viewSuggest(); } catch (err) { netErr(err); b.disabled = false; } };
    return;
  }
  $('#sg').innerHTML = `<div class="pad"><form class="card f" id="sgf" style="padding:16px">
      <div style="display:flex;gap:12px;align-items:center"><span class="ic">${ic('bulb', 24)}</span><div><div style="font-size:18px;font-weight:700">Share an idea</div><div class="hint">Your suggestion goes straight to ${esc(ADMIN_NAME)}.</div></div></div>
      <div class="two"><div class="fld"><label for="sg-n">Name</label><input id="sg-n" value="${esc(ME.name)}" required></div><div class="fld"><label for="sg-s">SAP ID</label><input id="sg-s" value="${esc(ME.sap_id || '')}" inputmode="text"></div></div>
      <div class="fld"><label for="sg-a">Area</label>${combo('sg-a', '', true, 'e.g. FM, RM, Power, Shift')}</div>
      <div class="fld"><label for="sg-m">Suggestion for (module)</label>${combo('sg-m', '', false, 'Choose a module')}</div>
      <div class="fld"><label for="sg-d">Description</label><textarea id="sg-d" rows="5" maxlength="2000" placeholder="What should be added or changed, and why?"></textarea></div>
      <button class="btn pri block" type="submit" id="sg-go">${ic('ok')} Submit</button></form>
    ${rows.length ? `<div class="label" style="margin-top:20px">${admin ? 'Sent by you' : 'Your suggestions'}</div>${(admin ? rows.filter(r => r.name === ME.name) : rows).map(r => card(r, false)).join('')}` : ''}</div>`;
  wireCombo('sg-a', ['Automation (L1)', 'CB', 'Coiler / DC', 'Crane', 'FM', 'Instrument', 'Motor', 'Planning', 'Power', 'RHF', 'RM', 'Shift'], true);
  wireCombo('sg-m', SUG_MODULES, false);
  $('#sgf').onsubmit = async e => { e.preventDefault();
    const body = { name: $('#sg-n').value.trim(), sap_id: $('#sg-s').value.trim() || null, area: $('#sg-a').value.trim() || null, module: $('#sg-m').value.trim(), description: $('#sg-d').value.trim() };
    if (!body.name) return toast('Enter your name'); if (!body.module) return toast('Choose the module'); if (body.description.length < 3) return toast('Write your suggestion');
    $('#sg-go').disabled = true;
    try { await api('suggestions', { method: 'POST', body, prefer: 'return=minimal' }); logAct('suggest', 'Suggestion sent', (body.module || '') + ' · ' + String(body.description || '').slice(0, 80)); toast('Thank you! Suggestion sent'); if (admin) S.sugTab = 'new'; viewSuggest(); }
    catch (err) { netErr(err); $('#sg-go').disabled = false; } };
}

/* ================= ABOUT ================= */
function viewAbout() {
  $('#app').innerHTML = `${bar('About this app', 'home')}<main class="scroll"><div class="pad">
    <div class="card about"><img src="img/coil.png" alt="" class="alogo"><h2>HSM E&amp;A App</h2><div class="motto">One action, multiple solutions.</div><div class="hint">Version ${APP_VERSION} · build ${esc(window.HSM_APP_VERSION || 0)}</div>
      <p>One app for the Electrical &amp; Automation team of the Hot Strip Mill: shift schedule, check lists, spares, SOPs, TBT and contacts – on Android and iPhone.</p>
      <div class="by"><span class="k">Designed &amp; developed by</span><b>Shashank Agrawal</b><span>HSM – Electrical &amp; Automation</span></div></div>
    <p class="hint" style="text-align:center;margin-top:18px">For ideas or problems use <a href="#suggest" style="color:var(--red);font-weight:700">Suggestions</a>.</p></div></main>`;
}



/* ================= CLEAR LOGS (app admin only) ================= */
async function viewClearLogs() {
  if (!ME.is_admin) return go('home');
  S.clAge = S.clAge || '0';
  $('#app').innerHTML = `${bar('Clear logs', 'profile')}<main class="scroll" id="clg"><div class="spin">Loading…</div></main>`;
  let acts = [], users = [];
  try { [acts, users] = await Promise.all([api('activity_log?select=module&limit=5000'), rpc('hsm_users')]); } catch (e) { netErr(e); }
  users = (users || []).filter(u => u.status === 'approved');
  const byMod = {}; (acts || []).forEach(r => { const k = r.module || 'other'; byMod[k] = (byMod[k] || 0) + 1; });
  const modName = k => (MODULES.find(m => m[0] === k) || [k, { admin: 'Admin', suggest: 'Suggestions', profile: 'Profile', other: 'Other' }[k] || k])[1].replace(/&amp;/g, '&').replace(/&#39;/g, '’');
  const age = () => S.clAge;
  const ageTxt = () => age() === '0' ? 'ALL entries' : `entries older than ${age()} days`;
  const cutoff = () => age() === '0' ? '' : new Date(Date.now() - (+age()) * 864e5).toISOString();
  const chip = (kind, v, label, n) => `<button class="chip clchip" data-k="${kind}" data-v="${esc(v)}">${esc(label)}${n != null ? ` <b>${n}</b>` : ''}</button>`;
  $('#clg').innerHTML = `<div class="pad"><div class="card" style="padding:14px"><div style="font-weight:700;font-size:17px">What to clear</div>
      <div class="hint" style="margin:4px 0 8px">Only you can see this page. Clearing cannot be undone. Tap a chip to clear that part only.</div>
      <div class="fld"><label for="clage">Clear</label><select id="clage"><option value="0">Everything</option><option value="7">Older than 7 days</option><option value="30">Older than 30 days</option><option value="90">Older than 90 days</option><option value="365">Older than 1 year</option></select></div></div>
    <div class="label" style="margin-top:14px">Activity log – by module (who changed what, shift schedule log)</div><div class="chips">${Object.keys(byMod).sort().map(k => chip('act', k, modName(k), byMod[k])).join('') || '<span class="hint">Empty</span>'}${Object.keys(byMod).length ? chip('act', '*', 'All modules') : ''}</div>
    <div class="label" style="margin-top:14px">Spares – stock history, by area</div><div class="chips">${SPARE_AREAS.map(a => chip('slog', a, a)).join('')}${chip('slog', '*', 'All areas')}</div>
    <div class="label" style="margin-top:14px">Spares – Planning comments, by area</div><div class="chips">${SPARE_AREAS.map(a => chip('scm', a, a)).join('')}${chip('scm', '*', 'All areas')}</div>
    <div class="label" style="margin-top:14px">Sign-in log</div><div class="chips">${chip('login', '*', 'All users')}</div>
    <div class="fld" style="margin-top:8px"><label for="clu">Or one person</label><select id="clu"><option value="">Choose person…</option>${users.map(u => `<option value="${u.id}">${esc(u.full_name)}</option>`).join('')}</select></div>
    <div style="height:30px"></div></div>`;
  $('#clage').value = S.clAge; $('#clage').onchange = () => { S.clAge = $('#clage').value; };
  const del = async (path, tcol) => { const c = cutoff(); return (await api(`${path}${c ? `${path.includes('?') ? '&' : '?'}${tcol}=lt.${encodeURIComponent(c)}` : ''}${path.includes('?') || c ? '&' : '?'}select=id`, { method: 'DELETE' })) || []; };
  const spareIds = async a => { const r = await api(a === '*' ? 'spares?select=id&limit=5000' : `spares?select=id&area=eq.${encodeURIComponent(a)}&limit=5000`); return (r || []).map(x => x.id); };
  const run = async (kind, v, label) => {
    if (!(await ask(`Clear ${label}?`, `This removes ${ageTxt()}. It cannot be undone.`, 'Clear', 'Cancel', true))) return;
    let n = 0;
    try {
      if (kind === 'act') n = (await del(v === '*' ? 'activity_log?id=gt.0' : `activity_log?module=eq.${encodeURIComponent(v)}`, 'at')).length;
      else if (kind === 'login') n = (await del(v === '*' ? 'login_log?id=gt.0' : `login_log?user_id=eq.${encodeURIComponent(v)}`, 'at')).length;
      else { const ids = await spareIds(v), tbl = kind === 'slog' ? 'spare_log' : 'spare_comments';
        for (let i = 0; i < ids.length; i += 150) n += (await del(`${tbl}?spare_id=in.(${ids.slice(i, i + 150).join(',')})`, 'created_at')).length; }
      toast(n ? `Cleared ${n} entr${n > 1 ? 'ies' : 'y'}` : 'Nothing to clear', 3500); if (kind === 'act') viewClearLogs();
    } catch (e) { netErr(e); }
  };
  $('#clg').onclick = e => { const b = e.target.closest('.clchip'); if (b) run(b.dataset.k, b.dataset.v, `${{ act: 'activity log', slog: 'stock history', scm: 'Planning comments', login: 'sign-in log' }[b.dataset.k]} – ${b.textContent.replace(/\s*\d+$/, '').trim()}`); };
  $('#clu').onchange = () => { const id = $('#clu').value; if (!id) return; const u = users.find(x => String(x.id) === id); $('#clu').value = ''; run('login', id, `sign-in log – ${u ? u.full_name : ''}`); };
}

/* ================= ACTIVITY LOG ================= */
async function viewActivity() {
  const only = S.actOnly || null;
  if (only ? !(ME.is_admin || isModAdmin(only)) : !(ME.is_admin || (ME.admin_modules || []).length)) return go('home');
  S.actMod = only || S.actMod || 'all';
  const modName = k => (MODULES.find(m => m[0] === k) || [k, { admin: 'Admin', suggest: 'Suggestions', profile: 'Profile' }[k] || k])[1].replace(/&#39;|'/g, '’').replace(/&amp;/g, '&');
  $('#app').innerHTML = `${bar(only ? `${modName(only)} – activity log` : 'Activity log', only ? (S.actBack || 'home') : 'profile')}${only ? '' : '<div class="tabs" id="actt"></div>'}<main class="scroll" id="al2x"><div class="spin">Loading…</div></main>`;
  let rows = []; try { rows = await rpc('hsm_activity', { p_module: only, p_limit: 500 }) || []; } catch (e) { netErr(e); $('#al2x').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  const mods = ['all', ...Array.from(new Set(rows.map(r => r.module).filter(Boolean)))];
  const draw = () => {
    if ($('#actt')) $('#actt').innerHTML = mods.map(k => `<button data-k="${k}" class="${S.actMod === k ? 'on' : ''}">${k === 'all' ? 'All' : esc(modName(k))}</button>`).join('');
    const f = rows.filter(r => S.actMod === 'all' || r.module === S.actMod); let lastDay = '';
    $('#al2x').innerHTML = `<div class="pad">${f.length ? f.map(r => { const d = new Date(r.at), day = fmtShort(d), head = day !== lastDay ? `<div class="label" style="margin-top:14px">${day === fmtShort(new Date()) ? 'Today' : day}</div>` : ''; lastDay = day;
      return `${head}<div class="card actv"><span class="tm">${pad2(d.getHours())}:${pad2(d.getMinutes())}</span><div class="tx"><div class="a">${esc(r.action)}</div><div class="b">${esc(r.name || '')} · ${esc(modName(r.module))}${r.detail ? ' · ' + esc(r.detail) : ''}</div></div></div>`; }).join('')
      : '<div class="empty"><b>No activity yet</b>Changes made by team members show up here.</div>'}</div>`;
  };
  if ($('#actt')) $('#actt').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; S.actMod = b.dataset.k; draw(); };
  draw();
}

/* ================= LEAVE REQUEST ================= */
const LEAVE_TYPES = [['CL', 'Casual leave'], ['SL', 'Sick leave'], ['EL', 'Earned / privilege'], ['CO', 'Comp-off'], ['OTH', 'Other']];
const leaveName = c => (LEAVE_TYPES.find(x => x[0] === c) || [c, c])[1];
const LSTAT = { pending: ['Pending', 'amber'], approved: ['Approved', 'green'], rejected: ['Rejected', 'red'], cancelled: ['Withdrawn', 'grey'] };
const fmtRange = r => r.from_day === r.to_day ? fmtShort(fromYmd(r.from_day)) : `${fmtShort(fromYmd(r.from_day))} → ${fmtShort(fromYmd(r.to_day))}`;
const dayN = n => `${n} day${n === 1 ? '' : 's'}`;
/* ---- shift change request ---- */
const SC_KINDS = { swap: 'Swap shift with colleague', cover: 'Leave + colleague covers', other: 'Other request' };
const SC_AREAS = [['*', 'All areas (shift schedule managers)'], ['L1', 'L1'], ['RM', 'RM'], ['FM', 'FM'], ['DC', 'DC'], ['Power', 'Power'], ['Drive', 'Drive'], ['Motor', 'Motor'], ['Crane', 'Crane'], ['Instrument', 'Instrument'], ['Shift', 'Shift'], ['Planning', 'Planning']];
const SC_SH = { A: 'A shift', B: 'B shift', C: 'C shift', G: 'General', WO: 'Weekly off', L: 'On leave', COFF: 'Comp-off' };
const scCrewCache = {};
async function scCrew(day) { if (!scCrewCache[day]) scCrewCache[day] = (await rpc('hsm_sc_crew', { p_day: day })) || []; return scCrewCache[day]; }
function scCrewHtml(crew, area, hi) {
  hi = hi || []; let rows = crew; if (area && crew.some(r => r.area === area)) rows = crew.filter(r => r.area === area);
  if (!rows.length) return '<div class="hint">No schedule uploaded for this date</div>';
  const by = {}; rows.forEach(r => (by[r.shift] = by[r.shift] || []).push(r));
  const order = [...['A', 'B', 'C', 'G'].filter(k => by[k]), ...Object.keys(by).filter(k => !['A', 'B', 'C', 'G'].includes(k)).sort()];
  return order.map(k => `<div class="scs"><b>${esc(SC_SH[k] || k)}</b><span class="chips">${by[k].map(r => `<span class="chip ${hi.some(h => h && sameName(h, r.name)) ? 'me' : ''}">${esc(r.name)}</span>`).join('')}</span></div>`).join('');
}
const scCombo = (c, s) => (!c || ['WO', 'L', 'G', 'COFF'].includes(c)) ? s : (c < s ? c + '+' + s : s + '+' + c);
const scEffect = r => r.kind === 'swap' ? `${firstName(r.name)}: ${r.my_shift} → ${r.with_shift}  ·  ${firstName(r.with_name)}: ${r.with_shift} → ${r.my_shift}`
  : r.kind === 'cover' ? `${firstName(r.name)}: ${r.my_shift} → Leave  ·  ${firstName(r.with_name)}: ${r.with_shift} → ${scCombo(r.with_shift, r.my_shift)}${r.comp_day ? `  ·  ${firstName(r.with_name)} comp-off on ${fmtShort(fromYmd(r.comp_day))}` : ''}` : '';
function scRequestSheet() {
  const md = $('#modal'); let kind = 'swap'; const tom = ymd(new Date(Date.now() + 864e5));
  md.innerHTML = `<div class="sheet" style="max-height:92vh;overflow:auto"><h3>Shift change request</h3>
    <div class="label" style="margin:10px 0 6px">What do you need?</div><div class="ltypes" id="sck">${Object.entries(SC_KINDS).map(([k, n]) => `<button type="button" data-k="${k}" class="${k === kind ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>
    <div class="fld" style="margin-top:12px"><label for="scd">Date</label><input type="date" id="scd" value="${tom}"></div>
    <div class="scinfo" id="scinfo"><div class="hint">Loading…</div></div>
    <div class="fld" id="scwf"><label for="scw" id="scwl">Swap with</label><div class="ltypes" id="scft" style="margin-bottom:8px"></div><select id="scw"></select></div>
    <div class="fld" id="scc" style="display:none"><label class="admchk"><input type="checkbox" id="scck" checked><span>Colleague takes comp-off on</span></label><input type="date" id="sccd"></div>
    <div class="sceff" id="scpv"></div>
    <div class="fld"><label for="scre">Reason / message to approver</label><textarea id="scre" rows="2" maxlength="400" placeholder="Short reason"></textarea></div>
    <div class="two"><button class="btn ghost" id="scx">Cancel</button><button class="btn pri" id="scg">Send request</button></div></div>`;
  md.classList.remove('hidden'); md.onclick = null;
  let crew = [], me = null, others = [], fsh = 'all';
  const peek = () => { const w = others.find(r => r.name === $('#scw').value); return { w }; };
  const preview = () => { const pv = $('#scpv'); if (!me || kind === 'other') { pv.textContent = ''; return; } const { w } = peek(); if (!w) { pv.textContent = ''; return; }
    const r = { kind, name: ME.name, my_shift: me.shift, with_name: w.name, with_shift: w.shift, comp_day: kind === 'cover' && $('#scck').checked ? $('#sccd').value : null };
    pv.innerHTML = `<b>After approval:</b><br>${esc(scEffect(r)).replace(/ {2}· {2}/g, '<br>')}`; };
  const draw = () => { $('#scwf').style.display = kind === 'other' ? 'none' : ''; $('#scc').style.display = kind === 'cover' ? '' : 'none';
    $('#scwl').textContent = kind === 'swap' ? 'Swap with' : 'Colleague who will cover your shift';
    const SHT = [['all', 'All'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['G', 'G'], ['WO', 'W-Off'], ['L', 'L']];
    $('#scft').innerHTML = SHT.map(([k, l]) => `<button type="button" data-f="${k}" class="${k === fsh ? 'on' : ''}">${l}${k === 'all' ? ` (${crew.filter(r => !me || r.name !== me.name).length})` : ` (${crew.filter(r => r.shift === k && (!me || r.name !== me.name)).length})`}</button>`).join('');
    const ord = ['A', 'B', 'C', 'G', 'WO', 'L'];
    others = crew.filter(r => me && r.name !== me.name && (fsh === 'all' || r.shift === fsh)).sort((x, y) => (ord.indexOf(x.shift) + 1 || 9) - (ord.indexOf(y.shift) + 1 || 9) || x.name.localeCompare(y.name));
    $('#scw').innerHTML = others.map(r => `<option value="${esc(r.name)}">${esc(r.name)} — ${esc(SC_SH[r.shift] || r.shift)}${r.area ? ' · ' + esc(r.area) : ''}</option>`).join('') || '<option value="">No colleague in this shift</option>'; preview(); };
  $('#scft').onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; fsh = b.dataset.f; draw(); };
  const load = async () => { const d = $('#scd').value; $('#scinfo').innerHTML = '<div class="hint">Loading…</div>';
    try { crew = await scCrew(d); } catch (e) { crew = []; netErr(e); }
    me = crew.find(r => sameName(r.name, ME.name)) || null;
    $('#scinfo').innerHTML = me ? `<div class="scme">Your shift on ${fmtShort(fromYmd(d))}: <b>${esc(SC_SH[me.shift] || me.shift)}</b></div>${scCrewHtml(crew, me.area, [ME.name])}` : `<div class="hint" style="color:var(--amber)">${crew.length ? 'You are not in the shift schedule on this date.' : 'No shift schedule uploaded for this date.'}${kind === 'other' ? '' : ' Choose another date.'}</div>`;
    const nx = new Date(fromYmd(d).getTime() + 864e5); $('#sccd').value = ymd(nx); draw(); };
  $('#sck').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; kind = b.dataset.k; $$('#sck button').forEach(x => x.classList.toggle('on', x === b)); draw(); };
  $('#scd').onchange = load; $('#scw').onchange = preview; $('#scck').onchange = preview; $('#sccd').onchange = preview;
  $('#scx').onclick = () => md.classList.add('hidden');
  $('#scg').onclick = async () => { const btn = $('#scg'); const { w } = peek();
    if (kind !== 'other' && !w) return toast('Select the colleague');
    if (kind === 'other' && !$('#scre').value.trim()) return toast('Please write what you need');
    btn.disabled = true;
    try { await rpc('hsm_sc_apply', { p_kind: kind, p_day: $('#scd').value, p_with_name: kind === 'other' ? null : w.name, p_with_sap: kind === 'other' ? null : (w.sap_id || null),
        p_comp_day: kind === 'cover' && $('#scck').checked ? $('#sccd').value : null, p_reason: $('#scre').value });
      md.classList.add('hidden'); toast('Sent to your area approver'); S.leaveTab = 'shift'; viewLeave(); }
    catch (err) { btn.disabled = false; netErr(err); } };
  load();
}
async function drawApproverSetup(box) {
  let people = [], scApprs = [];
  try { [people, scApprs] = await Promise.all([rpc('hsm_leave_people'), rpc('hsm_sc_approvers')]); people = people || []; scApprs = scApprs || []; } catch (e) { netErr(e); }
  const names = id => (people.find(x => x.id === id) || {}).full_name;
  let body = '';
  {
    const opt = cur => `<option value="">Any approver / admin</option>${people.map(x => `<option value="${x.id}" ${cur === x.id ? 'selected' : ''}>${esc(x.full_name)}</option>`).join('')}`;
    body = `<div class="card" style="padding:14px;margin-bottom:12px"><div style="font-weight:700;font-size:17px">Who approves whose leave?</div><div class="hint" style="margin:4px 0 10px">Pick an approver for each person – anybody can be an approver. Picking someone gives them the approver right automatically. Without a choice, any approver or the app admin can decide.</div>
      <div class="fld" style="margin-bottom:8px"><label for="lball">Set one approver for everyone</label><select id="lball">${opt(null)}</select></div><button class="btn block" id="lballgo">Apply to everyone</button></div>
      ${people.map(x => `<div class="card lpers"><div class="tx"><div class="a">${esc(x.full_name)}</div><div class="b">${esc(x.sap_id || '')}${x.is_approver ? ' · approver' : ''}</div></div><select data-p="${x.id}" aria-label="Approver for ${esc(x.full_name)}">${opt(x.leave_approver)}</select></div>`).join('')}`;
        body += `<div class="card" style="padding:14px;margin:18px 0 12px"><div style="font-weight:700;font-size:17px">Shift change approvers (area-wise)</div><div class="hint" style="margin:4px 0 10px">Shift change requests go only to the approvers of the person’s area. “All areas” approvers (shift schedule managers) can decide for every area. Anybody can be added.</div>
      ${SC_AREAS.map(([k, lbl]) => { const mem = scApprs.filter(x => x.area === k);
        return `<div class="scarea"><div class="a">${esc(lbl)}</div><div class="chips">${mem.map(x => `<span class="chip">${esc(x.name)}<button class="scx" data-scx="${esc(k)}|${x.user_id}" aria-label="Remove ${esc(x.name)}">✕</button></span>`).join('') || '<span class="hint">No approver – only app admin can decide</span>'}</div>
        <select data-scadd="${esc(k)}" aria-label="Add approver for ${esc(lbl)}"><option value="">+ Add approver…</option>${people.filter(p => !mem.some(x => x.user_id === p.id)).map(p => `<option value="${p.id}">${esc(p.full_name)}</option>`).join('')}</select></div>`; }).join('')}</div>`;
  }
  box.innerHTML = `<div class="pad">${body}</div>`;
  const again = () => drawApproverSetup(box);
  box.onchange = async e => { const s = e.target.closest('[data-scadd]'); if (!s || !s.value) return;
    try { await rpc('hsm_sc_set_approver', { p_area: s.dataset.scadd, p_user: +s.value, p_on: true }); toast('Approver added'); again(); } catch (err) { netErr(err); } };
  box.onclick = async e => { const x = e.target.closest('[data-scx]'); if (!x) return; const [a, u] = x.dataset.scx.split('|');
    try { await rpc('hsm_sc_set_approver', { p_area: a, p_user: +u, p_on: false }); toast('Approver removed'); again(); } catch (err) { netErr(err); } };
  $$('select[data-p]', box).forEach(sel => sel.onchange = async () => { try { await rpc('hsm_leave_set_approver', { p_ids: [+sel.dataset.p], p_approver: sel.value ? +sel.value : null }); toast('Approver saved'); } catch (e) { netErr(e); } });
  $('#lballgo', box).onclick = async () => { const v = $('#lball', box).value; if (!v) return toast('Choose the approver first');
    if (!(await ask('Set this approver for everyone?', `${names(+v)} will approve leave for all ${people.length} people.`, 'Apply'))) return;
    try { await rpc('hsm_leave_set_approver', { p_ids: people.map(x => x.id), p_approver: +v }); toast('Approver set for everyone'); again(); } catch (e) { netErr(e); } };
}
async function viewLeave() {
  const admin = isModAdmin('leave'); store.set('hsm_leave_seen', Date.now()); Object.keys(scCrewCache).forEach(k => delete scCrewCache[k]);
  S.leaveTab = admin ? (S.leaveTab || 'mine') : (['shift', 'month'].includes(S.leaveTab) ? S.leaveTab : 'mine');
  if (!S.leaveMonth) { const t = new Date(); S.leaveMonth = new Date(t.getFullYear(), t.getMonth(), 1); }
  const m = S.leaveMonth, y = m.getFullYear(), mo = m.getMonth(), first = ymd(m), last = ymd(new Date(y, mo + 1, 0));
  $('#app').innerHTML = `${bar('Leave Request', 'home', logBtn('leave'))}<main class="scroll" id="lv" style="padding-bottom:96px"><div class="spin">Loading…</div></main>
    <button class="fab" id="scnew" style="bottom:160px">${ic('cal', 22)} Shift change request</button>
    <button class="fab" id="lnew" style="bottom:88px">${ic('plus', 22)} Request leave</button>${nav('')}`;
  let rows = []; try { rows = await api(`leave_requests?select=*&from_day=lte.${last}&to_day=gte.${first}&order=from_day,id`); } catch (e) { $('#lv').innerHTML = '<div class="empty"><b>Could not load</b>Check network and try again.</div>'; netErr(e); return; }
  let pend = []; if (admin) { try { pend = await api('leave_requests?select=*&status=eq.pending&order=created_at'); } catch (e) {} }
  const mine = rows.filter(r => r.auth_id === (SESSION && uidOfToken())), tab = S.leaveTab;
  const pill = st => `<span class="lpill ${LSTAT[st][1]}">${LSTAT[st][0]}</span>`;
  const mhead = `<div class="cal-h" style="margin:0 0 10px"><button class="ib" id="lpm" aria-label="Previous month">${ic('back')}</button><h2 style="font-size:20px">${MONTHS[mo]} ${y}</h2><button class="ib" id="lnm" aria-label="Next month">${ic('chev')}</button></div>`;
  const card = (r, who) => `<div class="card lcard ${r.status}"><div class="lt"><span class="ltype">${esc(r.leave_type)}</span><div class="tx"><div class="a">${who ? esc(r.name) : esc(leaveName(r.leave_type))}</div><div class="b">${fmtRange(r)}${r.half ? ` · ${r.half === 'first' ? 'first half off' : 'second half off'}` : ''} · ${dayN(+r.days)}</div></div>${pill(r.status)}</div>
      ${who ? `<div class="hint">${esc(leaveName(r.leave_type))}${r.sap_id ? ' · ' + esc(r.sap_id) : ''}</div>` : ''}
      ${r.reason ? `<div class="lr">“${esc(r.reason)}”</div>` : ''}
      ${r.decided_by && r.status !== 'pending' ? `<div class="hint" style="margin-top:6px">${r.status === 'cancelled' ? 'Withdrawn' : LSTAT[r.status][0]} by ${esc(r.decided_by)} · ${fmtStamp(r.decided_at)}${r.decision_note ? ' · ' + esc(r.decision_note) : ''}${r.roster_marked ? ' · marked L in schedule' : ''}</div>` : ''}
      ${r.status === 'pending' && !who ? `<button class="linkbtn" data-cancel="${r.id}">${ic('x', 18)} Withdraw request</button>` : ''}
      ${r.status === 'approved' && r.to_day >= ymd(new Date()) && (!who || admin) ? `<button class="linkbtn" data-lrev="${r.id}">${ic('x', 18)} Cancel approved leave</button>` : ''}
      ${r.status === 'pending' && who && admin ? `<div class="two" style="margin-top:10px"><button class="btn" data-rej="${r.id}">${ic('x')} Reject</button><button class="btn pri" data-app="${r.id}">${ic('ok')} Approve</button></div>${clash(r)}` : ''}</div>`;
  const clash = r => { const o = rows.filter(x => x.id !== r.id && ['approved', 'pending'].includes(x.status) && x.from_day <= r.to_day && x.to_day >= r.from_day); return o.length ? `<div class="hint" style="color:var(--amber);margin-top:8px">⚠ ${o.length} other${o.length > 1 ? 's' : ''} on leave in these dates: ${esc(o.slice(0, 4).map(x => firstName(x.name)).join(', '))}${o.length > 4 ? '…' : ''}</div>` : ''; };
  let body = '', people = [], scMine = [], scPend = [], scAll = [], scApprs = [];
  if (tab === 'shift') { try { [scMine, scPend, scAll] = await Promise.all([rpc('hsm_sc_list', { p_scope: 'mine' }), rpc('hsm_sc_list', { p_scope: 'approve' }), rpc('hsm_sc_list', { p_scope: 'all' })]);
    scMine = scMine || []; scPend = scPend || []; scAll = (scAll || []).filter(r => r.status !== 'pending' && r.auth_id !== (SESSION && uidOfToken())); } catch (e) { netErr(e); } }
  let lm = [];
  if (tab === 'month') { try { lm = (await rpc('hsm_leave_month', { p_from: first, p_to: last })) || []; } catch (e) { netErr(e); } }
  if (tab === 'month') {
    const af = S.lmArea || '', sf = S.lmShift || '';
    const areas = [...new Set(lm.map(p => p.area).filter(Boolean))].sort(), shs = ['A', 'B', 'C', 'G'];
    const list = lm.filter(p => (!af || p.area === af) && (!sf || (p.shifts || []).includes(sf)));
    const onL = list.filter(p => p.leaves.length).length, ap = list.reduce((n, p) => n + p.leaves.filter(l => l.status === 'approved').length, 0), pn = list.reduce((n, p) => n + p.leaves.filter(l => l.status === 'pending').length, 0);
    const rng = l => { const f = l.from < first ? first : l.from, t = l.to > last ? last : l.to, fd = fromYmd(f), td = fromYmd(t); const s = d => d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); return f === t ? s(fd) : s(fd) + ' – ' + s(td); };
    const row = p => `<div class="lmr"><div class="lmn"><b>${esc(p.name)}</b><span>${esc(p.shift || '')}${p.shift && p.area ? ' · ' : ''}${esc(p.area || '')}</span></div><div class="lmd">${p.leaves.length ? p.leaves.map(l => `<span class="lmc ${l.status}">${rng(l)}${l.half ? ' ½' : ''}</span>`).join('') : '<span class="lmnone">No leave</span>'}</div></div>`;
    const grp = {}; list.forEach(p => { (grp[p.area || 'Other'] = grp[p.area || 'Other'] || []).push(p); });
    body = `${mhead}
      <div class="lachips" id="lmA"><button class="lachip ${af ? '' : 'on'}" data-a="">All areas</button>${areas.map(a => `<button class="lachip ${af === a ? 'on' : ''}" data-a="${esc(a)}">${esc(a)}</button>`).join('')}</div>
      <div class="lachips" id="lmS"><button class="lachip ${sf ? '' : 'on'}" data-s="">All shifts</button>${shs.map(s => `<button class="lachip ${sf === s ? 'on' : ''}" data-s="${s}">${s} shift</button>`).join('')}</div>
      <div class="lmleg"><span class="lmc approved">Approved ${ap}</span><span class="lmc pending">Pending ${pn}</span><span class="hint">${onL} of ${list.length} people on leave</span></div>
      ${list.length ? Object.keys(grp).sort().map(a => `<div class="label">${esc(a)} · ${grp[a].length}</div><div class="card lmt">${grp[a].map(row).join('')}</div>`).join('') : '<div class="empty"><b>No people found</b>Change the area or shift filter.</div>'}`;
  } else if (tab === 'shift') {
    const scCard = (r, mode) => `<div class="card lcard ${r.status}"><div class="lt"><span class="ltype">SC</span><div class="tx"><div class="a">${mode === 'mine' ? esc(SC_KINDS[r.kind]) : esc(r.name)}</div><div class="b">${fmtShort(fromYmd(r.day))}${mode === 'mine' ? '' : ' · ' + esc(SC_KINDS[r.kind])}${r.area ? ' · ' + esc(r.area) : ''}</div></div>${pill(r.status)}</div>
      ${r.kind === 'other' ? '' : `<div class="sceff">${esc(scEffect(r))}</div>`}
      ${r.reason ? `<div class="lr">“${esc(r.reason)}”</div>` : ''}
      ${r.status !== 'pending' && r.decided_by ? `<div class="hint" style="margin-top:6px">${r.status === 'cancelled' ? 'Withdrawn' : LSTAT[r.status][0]} by ${esc(r.decided_by)} · ${fmtStamp(r.decided_at)}${r.decision_note ? ' · ' + esc(r.decision_note) : ''}${r.applied ? ' · schedule updated' : ''}</div>` : ''}
      ${r.status === 'pending' ? `<div class="scw" data-day="${r.day}" data-comp="${r.comp_day || ''}" data-area="${esc(r.area || '')}" data-hi="${esc([r.name, r.with_name].filter(Boolean).join('|'))}"></div>` : ''}
      ${r.status === 'pending' && mode === 'mine' ? `<button class="linkbtn" data-sccx="${r.id}">${ic('x', 18)} Withdraw request</button>` : ''}
      ${r.status === 'approved' && r.applied && (r.comp_day || r.day) >= ymd(new Date()) && (mode === 'mine' || r.can_decide) ? `<button class="linkbtn" data-scrv="${r.id}">${ic('x', 18)} Cancel approved change (restore schedule)</button>` : ''}
      ${r.status === 'pending' && mode === 'dec' ? `<div class="two" style="margin-top:10px"><button class="btn" data-scr="${r.id}">${ic('x')} Reject</button><button class="btn pri" data-sca="${r.id}">${ic('ok')} Approve</button></div>` : ''}</div>`;
    body = `${scPend.length ? `<div class="label">${scPend.length} shift change${scPend.length > 1 ? 's' : ''} waiting for your decision</div>${scPend.map(r => scCard(r, 'dec')).join('')}` : ''}
      <div class="label">My shift change requests</div>${scMine.length ? scMine.map(r => scCard(r, 'mine')).join('') : '<div class="empty"><b>No shift change requests</b>Tap the red “Shift change request” button.</div>'}
      ${scAll.length ? `<div class="label" style="margin-top:14px">Recently decided (your areas)</div>${scAll.slice(0, 30).map(r => scCard(r, 'all')).join('')}` : ''}`;
  } else if (tab === 'mine') {
    const ap = mine.filter(r => r.status === 'approved'), days = ap.reduce((n, r) => n + +r.days, 0), pn = mine.filter(r => r.status === 'pending').length;
    body = `${mhead}<div class="lsum"><div><b>${days}</b><span>Approved days</span></div><div><b>${pn}</b><span>Pending</span></div><div><b>${mine.length}</b><span>Requests</span></div></div>
      ${mine.length ? mine.map(r => card(r, false)).join('') : `<div class="empty"><b>No leave in ${MONTHS[mo]}</b>Tap “Request leave” to apply.</div>`}`;
  } else if (tab === 'approve') {
    body = pend.length ? `<div class="label">${pend.length} waiting for your decision</div>${pend.map(r => card(r, true)).join('')}` : '<div class="empty"><b>Nothing pending</b>All leave requests are decided.</div>';
  } else {
    const dec = rows.filter(r => r.status !== 'pending'), ap = rows.filter(r => r.status === 'approved'), by = {};
    ap.forEach(r => { by[r.name] = (by[r.name] || 0) + +r.days; });
    body = `${mhead}<div class="lsum"><div><b>${ap.length}</b><span>Approved</span></div><div><b>${ap.reduce((n, r) => n + +r.days, 0)}</b><span>Leave days</span></div><div><b>${Object.keys(by).length}</b><span>People</span></div></div>
      ${rows.length ? `<button class="btn block" id="lxl" style="margin-bottom:12px">${ic('xls')} Excel of ${MONTHS[mo]}</button>` : ''}
      ${rows.length ? rows.map(r => card(r, true)).join('') : `<div class="empty"><b>No leave in ${MONTHS[mo]}</b></div>`}`;
  }
  $('#lv').innerHTML = `<div class="pad"><div class="seg" id="lseg" style="margin:0 0 12px">${[['mine', 'My leave'], ['shift', 'Shift change'], ['month', 'Month view'], ...(admin ? [['approve', `Approve${pend.length ? ` (${pend.length})` : ''}`], ['all', 'Report']] : [])].map(([k, l]) => `<button data-t="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}</div>${body}</div>`;
  if (tab === 'shift') { $$('#lv .scw').forEach(async el => { try {
      const days = [el.dataset.day, ...(el.dataset.comp ? [el.dataset.comp] : [])], hi = el.dataset.hi.split('|');
      const cr = await Promise.all(days.map(scCrew));
      el.innerHTML = days.map((d, i) => `<div class="scd">${i ? 'Comp-off day' : 'Shift crew'} · ${fmtShort(fromYmd(d))}</div>${scCrewHtml(cr[i], el.dataset.area, hi)}`).join(''); } catch (e) {} }); }
  { const on = $('#lseg .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }
  centerOn('#lseg .on');
  if ($('#lseg')) $('#lseg').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { S.leaveTab = b.dataset.t; viewLeave(); } };
  if (tab === 'month') { $('#scnew').style.display = 'none'; $('#lnew').style.display = 'none'; }
  if ($('#lmA')) { $('#lmA').onclick = e => { const b = e.target.closest('[data-a]'); if (b) { S.lmArea = b.dataset.a; viewLeave(); } }; $('#lmS').onclick = e => { const b = e.target.closest('[data-s]'); if (b) { S.lmShift = b.dataset.s; viewLeave(); } }; }
  if ($('#lpm')) { $('#lpm').onclick = () => { S.leaveMonth = new Date(y, mo - 1, 1); viewLeave(); }; $('#lnm').onclick = () => { S.leaveMonth = new Date(y, mo + 1, 1); viewLeave(); }; }
  $('#lv').onclick = async e => {
    const rv = e.target.closest('[data-lrev],[data-scrv]'); if (rv) { const isL = !!rv.dataset.lrev, rid = +(rv.dataset.lrev || rv.dataset.scrv), md = $('#modal');
      md.innerHTML = `<div class="sheet"><h3>Cancel approved ${isL ? 'leave' : 'shift change'}?</h3><p>The shift schedule goes back to what it was before${isL ? ' (from today onwards)' : ''}.</p>
        <div class="fld"><label for="rvn">Reason (optional)</label><input id="rvn" maxlength="200" placeholder="e.g. Need to attend duty" autocomplete="off"></div>
        <div class="two"><button class="btn ghost" id="rvx">Keep it</button><button class="btn pri" id="rvg">Yes, cancel</button></div></div>`;
      md.classList.remove('hidden'); md.onclick = null; $('#rvx').onclick = () => md.classList.add('hidden');
      $('#rvg').onclick = async () => { const note = $('#rvn').value.trim(); $('#rvg').disabled = true;
        try { const n = await rpc(isL ? 'hsm_leave_revoke' : 'hsm_sc_revoke', { p_id: rid, p_note: note }); md.classList.add('hidden');
          toast(n > 0 ? `Cancelled – schedule restored for ${n} entr${n > 1 ? 'ies' : 'y'}` : 'Cancelled – old entry not saved, please set the shift in the schedule manually', 5000); viewLeave(); } catch (err) { $('#rvg').disabled = false; netErr(err); } };
      return; }
    const sx = e.target.closest('[data-sccx]'); if (sx) { if (!(await ask('Withdraw this request?', '', 'Withdraw'))) return;
      try { await rpc('hsm_sc_cancel', { p_id: +sx.dataset.sccx }); toast('Request withdrawn'); viewLeave(); } catch (err) { netErr(err); } return; }
    const sd = e.target.closest('[data-sca],[data-scr]'); if (sd) { const sid = +(sd.dataset.sca || sd.dataset.scr), sok = !!sd.dataset.sca, sr = scPend.find(x => x.id === sid); if (!sr) return;
      const md = $('#modal');
      md.innerHTML = `<div class="sheet"><h3>${sok ? 'Approve' : 'Reject'} shift change</h3><p><b>${esc(sr.name)}</b> · ${esc(SC_KINDS[sr.kind])} · ${fmtShort(fromYmd(sr.day))}</p>${sr.kind === 'other' ? '' : `<div class="sceff">${esc(scEffect(sr))}</div>`}
        ${sok && sr.kind !== 'other' ? '<div class="hint" style="margin:6px 0">On approval the shift schedule is updated automatically.</div>' : ''}
        <div class="fld"><label for="dn">Note ${sok ? '(optional)' : ''}</label><input id="dn" maxlength="200" placeholder="${sok ? 'Approved' : 'Reason for rejecting'}" autocomplete="off"></div>
        <div class="two"><button class="btn ghost" id="dx">Cancel</button><button class="btn pri" id="dg">${sok ? 'Approve' : 'Reject'}</button></div></div>`;
      md.classList.remove('hidden'); md.onclick = null; $('#dx').onclick = () => md.classList.add('hidden');
      $('#dg').onclick = async () => { const note = $('#dn').value.trim(); if (!sok && !note) return toast('Please write a reason');
        try { await rpc('hsm_sc_decide', { p_id: sid, p_approve: sok, p_note: note }); md.classList.add('hidden'); toast(sok ? 'Approved – schedule updated' : 'Rejected'); viewLeave(); } catch (err) { netErr(err); } };
      return; }
    const c = e.target.closest('[data-cancel]'); if (c) { if (!(await ask('Withdraw this request?', '', 'Withdraw'))) return;
      try { await rpc('hsm_leave_cancel', { p_id: +c.dataset.cancel }); toast('Request withdrawn'); viewLeave(); } catch (err) { netErr(err); } return; }
    const a = e.target.closest('[data-app],[data-rej]'); if (!a) return;
    const id = +(a.dataset.app || a.dataset.rej), ok = !!a.dataset.app, r = pend.find(x => x.id === id) || rows.find(x => x.id === id); if (!r) return;
    const md = $('#modal');
    md.innerHTML = `<div class="sheet"><h3>${ok ? 'Approve' : 'Reject'} leave</h3><p><b>${esc(r.name)}</b> · ${esc(leaveName(r.leave_type))}<br>${fmtRange(r)} · ${dayN(+r.days)}</p>
      <div class="fld"><label for="dn">Note ${ok ? '(optional)' : ''}</label><input id="dn" maxlength="200" placeholder="${ok ? 'Enjoy your leave' : 'Reason for rejecting'}" autocomplete="off"></div>
      ${ok ? `<div class="hint" style="margin:4px 0 12px">${ic('cal', 16)} “L” will be marked in the shift schedule automatically for these dates.</div>` : ''}
      <div class="two"><button class="btn ghost" id="dx">Cancel</button><button class="btn pri" id="dg">${ok ? 'Approve' : 'Reject'}</button></div></div>`;
    md.classList.remove('hidden'); md.onclick = null;
    $('#dx').onclick = () => md.classList.add('hidden');
    $('#dg').onclick = async () => { const note = $('#dn').value.trim(); if (!ok && !note) return toast('Please write a reason');
      try { await rpc('hsm_leave_decide', { p_id: id, p_approve: ok, p_note: note, p_mark: ok }); md.classList.add('hidden'); toast(ok ? 'Leave approved' : 'Leave rejected'); viewLeave(); } catch (err) { netErr(err); } };
  };
  if ($('#lxl')) $('#lxl').onclick = async () => { try { toast('Preparing Excel…', 6000); const buf = await xl().leaveWorkbook(rows, `${MONTHS[mo]} ${y}`, leaveName, fmtShort, fromYmd); deliver(buf, `HSM E&A Leave ${MONTHS[mo]} ${y}.xlsx`, false); } catch (err) { netErr(err); } };
  if (tab === 'approve' || tab === 'all') { $('#lnew').style.display = 'none'; $('#scnew').style.display = 'none'; }
  if (tab === 'shift') $('#lnew').style.display = 'none';
  if (tab === 'shift') $('#scnew').style.bottom = '88px';
  $('#scnew').onclick = () => scRequestSheet();
  $('#lnew').onclick = () => {
    const t0 = ymd(new Date()); let type = 'CL';
    const md = $('#modal');
    md.innerHTML = `<div class="sheet" style="max-height:92vh;overflow:auto"><h3>Request leave</h3>
      <div class="label" style="margin:10px 0 6px">Leave type</div><div class="ltypes" id="lt">${LEAVE_TYPES.map(([k, n]) => `<button type="button" data-k="${k}" class="${k === type ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>
      <div class="two" style="margin-top:12px"><div class="fld"><label for="lf">From</label><input type="date" id="lf" value="${t0}"></div><div class="fld"><label for="ltt">To</label><input type="date" id="ltt" value="${t0}"></div></div>
      <div class="fld" id="lhw"><label for="lh">Duration</label><select id="lh"><option value="">Full day</option><option value="first">Half day – first half off</option><option value="second">Half day – second half off</option></select></div>
      <div class="fld"><label for="lre">Reason</label><textarea id="lre" rows="2" maxlength="300" placeholder="Short reason"></textarea></div>
      <div class="lcalc" id="lcalc"></div>
      <div class="two"><button class="btn ghost" id="lx">Cancel</button><button class="btn pri" id="lg">Send request</button></div></div>`;
    md.classList.remove('hidden'); md.onclick = null;
    const calc = () => { const f = $('#lf').value, t = $('#ltt').value; if (t < f) $('#ltt').value = f; const t2 = $('#ltt').value; $('#lhw').style.display = f === t2 ? '' : 'none'; if (f !== t2) $('#lh').value = '';
      const n = Math.round((fromYmd(t2) - fromYmd(f)) / 864e5) + 1 - ($('#lh').value ? 0.5 : 0); $('#lcalc').innerHTML = `${ic('cal', 18)} <b>${dayN(n)}</b> · ${fmtRange({ from_day: f, to_day: t2 })}`; return n; };
    calc();
    $('#lt').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; type = b.dataset.k; $$('#lt button').forEach(x => x.classList.toggle('on', x === b)); };
    ['lf', 'ltt', 'lh'].forEach(i => $('#' + i).onchange = calc);
    $('#lx').onclick = () => md.classList.add('hidden');
    $('#lg').onclick = async () => { const btn = $('#lg'); btn.disabled = true;
      try { await rpc('hsm_leave_apply', { p_type: type, p_from: $('#lf').value, p_to: $('#ltt').value, p_half: $('#lh').value, p_reason: $('#lre').value }); md.classList.add('hidden'); toast('Leave request sent for approval');
        S.leaveTab = 'mine'; const f = fromYmd($('#lf').value); S.leaveMonth = new Date(f.getFullYear(), f.getMonth(), 1); viewLeave(); }
      catch (err) { btn.disabled = false; netErr(err); } };
  };
}
// the signed-in user's auth id, read from the access token
function uidOfToken() { try { return JSON.parse(atob(SESSION.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub; } catch (e) { return null; } }

/* ================= START ================= */
applySettings(store.get('hsm_set', {}));
render();
document.addEventListener('visibilitychange', () => { if (!document.hidden && SESSION) loadSettings().then(ch => { if (ch) softRerender(); }); });

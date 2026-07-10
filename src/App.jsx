import React, { useState, useMemo } from "react";
import {
  BedDouble, CalendarDays, Utensils, Bell, QrCode, ClipboardList, Repeat2,
  LogIn, Wrench, MessageSquareWarning, Activity, BarChart3, Target, FileText,
  ChevronRight, Check, Clock, AlertCircle, Sparkles, X, BellRing, UserPlus,
  TrendingUp, TrendingDown, Lock, ShieldCheck, Bus, ScanLine, CalendarX, CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// ---------- design tokens ----------
// ink:#1A1A1A  paper:#FFFFFF  primary rose:#E05C7A  card:#FFF7F9  border:#F9D0D8  amber:#C8862E  sage:#3E8E76

// ---------- bus schedule data ----------
const BUS_SCHEDULE = {
  arrival: [
    { id: "a1", label: "월요일 입소", date: "2026-07-06", time: "08:00", from: "서울역 버스환승센터", seats: 45, booked: 32 },
    { id: "a2", label: "월요일 입소", date: "2026-07-06", time: "10:00", from: "서울역 버스환승센터", seats: 45, booked: 28 },
  ],
  departure: [
    { id: "d1", label: "수요일 퇴소", date: "2026-07-08", time: "17:00", to: "서울역 버스환승센터", seats: 45, booked: 18 },
    { id: "d2", label: "금요일 퇴소", date: "2026-07-10", time: "17:00", to: "서울역 버스환승센터", seats: 45, booked: 22 },
    { id: "d3", label: "금요일 퇴소", date: "2026-07-10", time: "19:00", to: "서울역 버스환승센터", seats: 45, booked: 15 },
  ],
};

// Deadline logic
// arrival (Monday) → deadline = previous Friday 18:00
// departure (Wed) → deadline = Tuesday 18:00, departure (Fri) → Thursday 18:00
function getBusDeadline(bus, type) {
  const d = new Date(bus.date + "T" + bus.time);
  if (type === "arrival") {
    // previous Friday
    const fri = new Date(d);
    fri.setDate(d.getDate() - 3);
    fri.setHours(18, 0, 0, 0);
    return fri;
  } else {
    // previous day 18:00
    const prev = new Date(d);
    prev.setDate(d.getDate() - 1);
    prev.setHours(18, 0, 0, 0);
    return prev;
  }
}
function deadlinePassed(bus, type) {
  return new Date() > getBusDeadline(bus, type);
}
function formatDeadline(bus, type) {
  const dl = getBusDeadline(bus, type);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${dl.getMonth() + 1}/${dl.getDate()}(${days[dl.getDay()]}) 18:00 마감`;
}

// ---------- design tokens ----------
// ink:#1A1A1A  paper:#FFFFFF  primary rose:#E05C7A  card:#FFF7F9  border:#F9D0D8  amber:#C8862E  sage:#3E8E76

const STATUS_STYLE = {
  "접수": { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", icon: Clock },
  "처리중": { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200", icon: AlertCircle },
  "완료": { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", icon: Check },
};

const seedRequests = [
  { id: 1, type: "facility", title: "3층 휴게실 에어컨 미작동", room: "312", time: "09:12", status: "완료", urgent: false },
  { id: 2, type: "roomchange", title: "코골이로 인한 객실 변경 요청", room: "215", time: "10:40", status: "처리중", urgent: false },
  { id: 3, type: "facility", title: "화장실 조명 깜빡임", room: "108", time: "11:05", status: "접수", urgent: true },
];

const kpiCompareData = [
  { name: "전화·방문\n문의", before: 100, after: 55 },
  { name: "처리\n평균시간", before: 100, after: 70 },
  { name: "재문의율", before: 100, after: 48 },
  { name: "보고서\n작성시간", before: 100, after: 30 },
];

const weeklyData = [
  { day: "월", count: 8 }, { day: "화", count: 11 }, { day: "수", count: 7 },
  { day: "목", count: 14 }, { day: "금", count: 9 }, { day: "토", count: 4 }, { day: "일", count: 3 },
];

function Eyebrow({ children, tone = "teal" }) {
  const toneMap = { teal: "text-[#C0425E]", amber: "text-amber-700", ink: "text-slate-500" };
  return (
    <div className={`text-xs font-mono font-semibold tracking-widest uppercase ${toneMap[tone]} mb-1`}>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

// ---------- ID badge (signature element) ----------
function IdBadge({ name = "교육생 1교시", room = "215호", code = "26-0612", issued = true, issuedAt = "" }) {
  if (!issued) {
    return (
      <div className="relative bg-white rounded-2xl shadow-lg ring-1 ring-[#F9D0D8] overflow-hidden" style={{ width: 260 }}>
        <div className="absolute left-0 right-0 top-0 flex justify-center" style={{ marginTop: -1 }}>
          <div className="bg-[#FFF7F9] rounded-b-full" style={{ width: 56, height: 14 }} />
        </div>
        <div className="bg-slate-300 px-4 pt-5 pb-3 text-white">
          <div className="text-[10px] font-mono tracking-widest text-slate-100">SMART CAMPUS DX · ID</div>
          <div className="text-sm font-bold mt-1">발급 대기 중</div>
        </div>
        <div className="px-4 py-6 flex flex-col items-center gap-2 text-slate-400">
          <Lock size={28} />
          <div className="text-xs text-center leading-relaxed">
            운영자의 입소 확인 후<br />학생증이 발급됩니다
          </div>
        </div>
        <div className="border-t border-dashed border-[#F9D0D8] px-4 py-2 text-[11px] text-slate-300 font-mono text-center">
          NOT ISSUED
        </div>
      </div>
    );
  }
  return (
    <div className="relative bg-white rounded-2xl shadow-lg ring-1 ring-[#F9D0D8] overflow-hidden" style={{ width: 260 }}>
      <div className="absolute left-0 right-0 top-0 flex justify-center" style={{ marginTop: -1 }}>
        <div className="bg-[#FFF7F9] rounded-b-full" style={{ width: 56, height: 14 }} />
      </div>
      <div className="bg-[#E05C7A] px-4 pt-5 pb-3 text-white">
        <div className="text-[10px] font-mono tracking-widest text-[#F4A7B3]">SMART CAMPUS DX · ID</div>
        <div className="text-sm font-bold mt-1">{name}</div>
      </div>
      <div className="px-4 py-4 flex items-center gap-4">
        <div className="flex items-center justify-center bg-[#FFF7F9] rounded-xl ring-1 ring-[#F9D0D8]" style={{ width: 76, height: 76 }}>
          <QrCode size={48} className="text-slate-700" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-mono">ROOM</div>
          <div className="text-2xl font-bold text-slate-800 leading-tight">{room}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">{code}</div>
        </div>
      </div>
      <div className="border-t border-dashed border-[#F9D0D8] px-4 py-2 text-[11px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
        <ShieldCheck size={12} className="text-emerald-500" /> {issuedAt ? `발급됨 · ${issuedAt}` : "SCAN AT ENTRANCE"}
      </div>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="mx-auto bg-white rounded-[2rem] shadow-xl ring-1 ring-[#F9D0D8] overflow-hidden flex flex-col" style={{ width: 340, height: 620 }}>
      <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-mono text-slate-400">
        <span>09:41</span>
        <span>Smart Campus DX</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-2">{children}</div>
    </div>
  );
}

function BottomNav({ items, active, onChange }) {
  return (
    <div className="grid grid-cols-5 border-t border-[#F9D0D8] bg-white">
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`flex flex-col items-center gap-1 py-2 text-[11px] ${isActive ? "text-[#E05C7A]" : "text-slate-400"}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Seat Map ----------
// 45석: 11행 × (A B | C D) = 44 + 마지막 1석
const ROWS = 11;
const COLS = ["A", "B", "C", "D"];
function seedOccupied(busId, booked) {
  // deterministic pseudo-random seating from busId seed
  const seats = [];
  for (let r = 1; r <= ROWS; r++) COLS.forEach(c => seats.push(`${r}${c}`));
  seats.push("12A"); // 45번째 자리
  let hash = 0;
  for (const ch of busId) hash = (hash * 31 + ch.charCodeAt(0)) & 0xfffffff;
  const occupied = new Set();
  let idx = hash % seats.length;
  while (occupied.size < booked) {
    occupied.add(seats[idx % seats.length]);
    idx = (idx * 6271 + 1) % seats.length;
  }
  return occupied;
}

function SeatMap({ bus, myCurrentSeat, onConfirm, onClose }) {
  const occupied = useMemo(() => seedOccupied(bus.id, bus.booked), [bus.id, bus.booked]);
  const [selected, setSelected] = useState(myCurrentSeat || null);

  function SeatBtn({ row, col }) {
    const id = `${row}${col}`;
    const isMine = id === myCurrentSeat;
    const isOcc = occupied.has(id) && !isMine;
    const isSel = id === selected;
    return (
      <button
        onClick={() => !isOcc && setSelected(isSel ? null : id)}
        disabled={isOcc}
        className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all
          ${isOcc ? "bg-slate-200 text-slate-400 cursor-not-allowed" :
            isSel ? "bg-[#E05C7A] text-white ring-2 ring-[#E05C7A] ring-offset-1 scale-105" :
            "bg-white ring-1 ring-[#F9D0D8] text-slate-600 hover:ring-[#E05C7A]"}`}>
        {id}
      </button>
    );
  }

  const allRows = [...Array(ROWS)].map((_, i) => i + 1);

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <button onClick={onClose} className="text-slate-400 text-xs">← 뒤로</button>
        <div className="text-xs font-semibold text-slate-600 text-center">
          {bus.label} · {bus.time}<br />
          <span className="text-[10px] font-normal text-slate-400">{bus.from || bus.to}</span>
        </div>
        <div className="w-8" />
      </div>

      {/* bus front */}
      <div className="flex justify-center mb-3">
        <div className="bg-[#E05C7A] text-white text-[11px] font-bold rounded-xl px-6 py-2 flex items-center gap-2">
          <Bus size={14} /> 앞
        </div>
      </div>

      {/* column header */}
      <div className="flex justify-center gap-1 mb-2">
        <div className="w-6" />
        <div className="w-8 text-center text-[10px] text-slate-400 font-mono">A</div>
        <div className="w-8 text-center text-[10px] text-slate-400 font-mono">B</div>
        <div className="w-5" />
        <div className="w-8 text-center text-[10px] text-slate-400 font-mono">C</div>
        <div className="w-8 text-center text-[10px] text-slate-400 font-mono">D</div>
      </div>

      {/* seat grid */}
      <div className="flex flex-col gap-1 overflow-y-auto flex-1 px-1">
        {allRows.map(r => (
          <div key={r} className="flex items-center justify-center gap-1">
            <div className="w-6 text-[10px] text-slate-300 font-mono text-right">{r}</div>
            <SeatBtn row={r} col="A" />
            <SeatBtn row={r} col="B" />
            <div className="w-5 flex items-center justify-center">
              <div className="h-4 border-l border-dashed border-[#F9D0D8]" />
            </div>
            <SeatBtn row={r} col="C" />
            <SeatBtn row={r} col="D" />
          </div>
        ))}
        {/* row 12 - single seat */}
        <div className="flex items-center justify-center gap-1">
          <div className="w-6 text-[10px] text-slate-300 font-mono text-right">12</div>
          <SeatBtn row={12} col="A" />
          <div className="w-8" />
          <div className="w-5" />
          <div className="w-8" />
          <div className="w-8" />
        </div>
      </div>

      {/* legend */}
      <div className="flex justify-center gap-4 py-2 border-t border-[#F9D0D8] mt-2">
        {[
          { color: "bg-white ring-1 ring-[#F9D0D8]", label: "선택가능" },
          { color: "bg-slate-200", label: "예약됨" },
          { color: "bg-[#E05C7A]", label: "선택됨" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className={`w-4 h-4 rounded ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* confirm */}
      <button
        onClick={() => selected && onConfirm(selected)}
        disabled={!selected}
        className={`mt-2 w-full py-2.5 rounded-xl text-sm font-semibold ${selected ? "bg-[#E05C7A] text-white" : "bg-slate-100 text-slate-300"}`}>
        {selected ? `${selected}번 좌석 예약 확정` : "좌석을 선택해주세요"}
      </button>
    </div>
  );
}

// ---------- Student view ----------
function StudentView({ requests, onSubmit, checkedIn, onToggleCheckin, idIssued, issuedAt, busReservation, onBusReserve, onBusCancel, myRoomChoice, onPickRoom }) {
  const [tab, setTab] = useState("room");
  const [form, setForm] = useState({ open: false, type: "facility", title: "" });
  const [busTab, setBusTab] = useState("arrival");
  const [busQr, setBusQr] = useState(null);
  const [seatMapBus, setSeatMapBus] = useState(null); // {bus, type} while picking seat
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);

  const navItems = [
    { key: "room", label: "내 객실", icon: BedDouble },
    { key: "schedule", label: "일정", icon: CalendarDays },
    { key: "meal", label: "식단", icon: Utensils },
    { key: "bus", label: "버스", icon: Bus },
    { key: "qr", label: "QR", icon: QrCode },
  ];

  const myRequests = requests.filter((r) => r.room === (myRoomChoice || "215"));

  function submit() {
    if (!form.title.trim()) return;
    onSubmit({ type: form.type, title: form.title, room: myRoomChoice || "215" });
    setForm({ open: false, type: "facility", title: "" });
  }

  return (
    <div className="flex flex-col">
      <PhoneFrame>
        {tab === "room" && (
          <div className="pt-2 space-y-4">
            <Eyebrow>내 객실</Eyebrow>

            {myRoomChoice ? (
              <>
                <div className="bg-[#E05C7A] rounded-2xl p-4 text-white">
                  <div className="text-xs text-[#F4A7B3] font-mono">CURRENT ROOM</div>
                  <div className="text-3xl font-bold mt-1">{myRoomChoice}호</div>
                  <div className="text-sm text-[#F4A7B3] mt-1 flex items-center gap-1">
                    <CheckCircle2 size={13} /> 본인이 직접 선택한 객실입니다
                  </div>
                </div>
                <div className="bg-[#FFF7F9] rounded-xl p-3 ring-1 ring-[#F9D0D8]">
                  <div className="text-xs text-slate-400">비품</div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">수건 2 · 이불 2</div>
                </div>
              </>
            ) : roomApplicationPassed() ? (
              <div className="bg-slate-100 rounded-2xl p-5 text-center">
                <Lock size={22} className="mx-auto text-slate-400 mb-2" />
                <div className="text-sm font-semibold text-slate-600">객실 신청기간이 마감되었습니다</div>
                <div className="text-xs text-slate-400 mt-1">운영자가 잔여 인원을 자동배정 중입니다. 배정 완료 시 알림으로 안내드립니다.</div>
              </div>
            ) : (
              <div className="bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold">
                  <Clock size={15} /> 객실 신청기간 안내
                </div>
                <div className="text-xs text-amber-600 mt-1">{formatRoomDeadline()}까지 직접 선택하지 않으면 운영자가 자동배정합니다.</div>
                <button
                  onClick={() => setRoomPickerOpen(true)}
                  className="mt-3 w-full bg-[#E05C7A] text-white text-sm font-semibold rounded-xl py-2.5"
                >
                  내 방 직접 선택하기
                </button>
              </div>
            )}

            <button
              onClick={() => setForm({ open: true, type: "facility", title: "" })}
              className="w-full text-sm font-semibold text-white bg-[#C8862E] rounded-xl py-2.5"
            >
              시설 고장 신고 / 비품 요청
            </button>

            {myRequests.length > 0 && (
              <div className="pt-2">
                <Eyebrow tone="ink">내 요청 현황</Eyebrow>
                <div className="space-y-2">
                  {myRequests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between bg-white ring-1 ring-[#F9D0D8] rounded-lg px-3 py-2">
                      <div className="text-sm text-slate-600 truncate pr-2">{r.title}</div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "schedule" && (
          <div className="pt-2 space-y-3">
            <Eyebrow>내 일정</Eyebrow>
            {[
              { t: "09:00", n: "디지털 행정혁신 이론", p: "201호 강의실" },
              { t: "11:00", n: "현장 실습 워크숍", p: "실습동 B" },
              { t: "14:00", n: "조별 발표", p: "201호 강의실" },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 bg-[#FFF7F9] rounded-xl p-3 ring-1 ring-[#F9D0D8]">
                <div className="text-sm font-mono font-semibold text-[#E05C7A] w-12">{s.t}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-700">{s.n}</div>
                  <div className="text-xs text-slate-400">{s.p}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 ring-1 ring-amber-200 rounded-lg px-3 py-2">
              <Bell size={14} /> 14:00 발표 장소가 304호로 변경되었습니다.
            </div>
          </div>
        )}

        {tab === "meal" && (
          <div className="pt-2 space-y-3">
            <Eyebrow>식단</Eyebrow>
            <div className="text-xs text-slate-400 font-mono">2026.06.29 (월)</div>
            {[
              { m: "조식", v: "07:00–08:30", f: "잡곡밥 · 된장국 · 계란말이" },
              { m: "중식", v: "12:00–13:30", f: "비빔밥 · 미역국 · 잡채" },
              { m: "석식", v: "18:00–19:30", f: "제육볶음 · 콩나물국" },
            ].map((m, i) => (
              <div key={i} className="bg-[#FFF7F9] rounded-xl p-3 ring-1 ring-[#F9D0D8]">
                <div className="flex justify-between text-sm font-semibold text-slate-700">
                  <span>{m.m}</span><span className="text-xs text-slate-400 font-mono">{m.v}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{m.f}</div>
              </div>
            ))}
            <div className="text-xs text-slate-400">⚠ 알레르기: 난류, 대두 포함</div>
          </div>
        )}

        {tab === "bus" && (
          <div className="pt-2 flex flex-col" style={{ minHeight: 530 }}>
            {seatMapBus ? (
              <SeatMap
                bus={seatMapBus.bus}
                myCurrentSeat={busReservation[seatMapBus.bus.id]?.seat}
                onClose={() => setSeatMapBus(null)}
                onConfirm={(seat) => {
                  onBusReserve(seatMapBus.bus.id, seatMapBus.type, seat);
                  setSeatMapBus(null);
                }}
              />
            ) : busQr ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <Eyebrow>탑승 확인 QR</Eyebrow>
                <div className="bg-white rounded-2xl shadow-lg ring-1 ring-[#F9D0D8] overflow-hidden" style={{ width: 240 }}>
                  <div className="bg-[#E05C7A] px-4 py-3 text-white">
                    <div className="text-[10px] font-mono tracking-widest text-[#F4A7B3]">SMART CAMPUS DX · BUS</div>
                    <div className="text-sm font-bold mt-1">{busQr.label}</div>
                    <div className="text-xs text-[#F4A7B3] mt-0.5">{busQr.date} {busQr.time}</div>
                  </div>
                  <div className="px-4 py-4 flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center bg-[#FFF7F9] rounded-xl ring-1 ring-[#F9D0D8]" style={{ width: 80, height: 80 }}>
                      <QrCode size={52} className="text-slate-700" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">교육생 1교시 · 215호</div>
                      {busReservation[busQr.id]?.seat && (
                        <div className="text-lg font-bold text-[#E05C7A] mt-1">
                          {busReservation[busQr.id].seat}석
                        </div>
                      )}
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">26-0612</div>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-[#F9D0D8] px-3 py-2 text-[10px] text-emerald-600 font-semibold font-mono text-center flex items-center justify-center gap-1">
                    <CheckCircle2 size={11} /> 탑승 시 스캔해주세요
                  </div>
                </div>
                <button onClick={() => setBusQr(null)} className="text-sm text-slate-400 underline">← 예약 목록으로</button>
              </div>
            ) : (
              <>
                <Eyebrow>버스 예약</Eyebrow>
                <div className="flex bg-slate-100 rounded-full p-0.5 mb-4 mt-1">
                  {[{ key: "arrival", label: "입소 버스" }, { key: "departure", label: "퇴소 버스" }].map(t => (
                    <button key={t.key} onClick={() => setBusTab(t.key)}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-full ${busTab === t.key ? "bg-[#E05C7A] text-white" : "text-slate-500"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {BUS_SCHEDULE[busTab].map(bus => {
                    const type = busTab;
                    const passed = deadlinePassed(bus, type);
                    const dlText = formatDeadline(bus, type);
                    const myRes = busReservation[bus.id];
                    const pct = Math.round(bus.booked / bus.seats * 100);
                    const full = bus.booked >= bus.seats;
                    return (
                      <div key={bus.id} className={`rounded-2xl ring-1 overflow-hidden ${myRes ? "ring-[#E05C7A]" : "ring-[#F9D0D8]"}`}>
                        <div className={`px-4 py-3 ${myRes ? "bg-[#E05C7A] text-white" : "bg-[#FFF7F9]"}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`text-sm font-bold ${myRes ? "text-white" : "text-slate-700"}`}>{bus.label}</div>
                              <div className={`text-xs mt-0.5 ${myRes ? "text-[#F4A7B3]" : "text-slate-400"}`}>
                                {bus.date} {bus.time} · {bus.from || bus.to}
                              </div>
                            </div>
                            <div className="text-right">
                              {myRes && <div className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full mb-1">예약완료</div>}
                              {myRes?.seat && <div className="text-sm font-bold text-[#F4A7B3]">{myRes.seat}석</div>}
                              {!myRes && full && <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full">마감</span>}
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className={myRes ? "text-[#F4A7B3]" : "text-slate-400"}>잔여 {bus.seats - bus.booked}석 / {bus.seats}석</span>
                              <span className={myRes ? "text-[#F4A7B3]" : "text-slate-400"}>{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                              <div className={`h-full rounded-full ${pct > 80 ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-2.5 bg-white flex items-center justify-between">
                          <div className={`text-[11px] flex items-center gap-1 ${passed ? "text-rose-500" : "text-slate-400"}`}>
                            {passed ? <CalendarX size={12} /> : <Clock size={12} />}
                            {dlText}
                          </div>
                          {myRes ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => setBusQr(bus)}
                                className="text-[11px] font-semibold text-[#E05C7A] bg-[#FFF7F9] ring-1 ring-[#F9D0D8] px-2 py-1 rounded-lg flex items-center gap-1">
                                <ScanLine size={12} /> 탑승QR
                              </button>
                              {!passed && (
                                <button onClick={() => setSeatMapBus({ bus, type })}
                                  className="text-[11px] font-semibold text-amber-600 bg-amber-50 ring-1 ring-amber-200 px-2 py-1 rounded-lg">
                                  좌석변경
                                </button>
                              )}
                              {!passed && (
                                <button onClick={() => onBusCancel(bus.id)}
                                  className="text-[11px] font-semibold text-rose-500 bg-rose-50 ring-1 ring-rose-100 px-2 py-1 rounded-lg">
                                  취소
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => !passed && !full && setSeatMapBus({ bus, type })}
                              disabled={passed || full}
                              className={`text-[11px] font-semibold px-3 py-1 rounded-lg ${passed || full ? "bg-slate-100 text-slate-300" : "bg-[#E05C7A] text-white"}`}>
                              {passed ? "마감됨" : full ? "만석" : "좌석 선택"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    · 입소 버스: 출발 전주 금요일 18:00 마감<br />
                    · 퇴소 버스: 출발 전날 18:00 마감<br />
                    · 마감 이후 예약·변경·취소 불가
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "qr" && (
          <div className="pt-4 flex flex-col items-center gap-4">
            <Eyebrow>입·퇴실 QR</Eyebrow>
            <IdBadge issued={idIssued} issuedAt={issuedAt} />
            <button
              onClick={onToggleCheckin}
              disabled={!idIssued}
              className={`w-full text-sm font-semibold rounded-xl py-2.5 ${
                !idIssued ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : checkedIn ? "bg-slate-100 text-slate-500" : "bg-[#3E8E76] text-white"
              }`}
            >
              {!idIssued ? "체크인 불가" : checkedIn ? "퇴실 처리" : "입실 체크인"}
            </button>
            <div className="text-xs text-slate-400">
              {!idIssued ? "학생증 발급 후 체크인이 가능합니다 (운영자 탭 → 입퇴실)" : checkedIn ? "현재 입실 중입니다" : "아직 체크인하지 않았습니다"}
            </div>
          </div>
        )}
      </PhoneFrame>
      <div style={{ width: 340 }} className="mx-auto">
        <BottomNav items={navItems} active={tab} onChange={setTab} />
      </div>

      {form.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-slate-800">시설 고장 신고</div>
              <button onClick={() => setForm({ ...form, open: false })}><X size={18} className="text-slate-400" /></button>
            </div>
            <textarea
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="예: 화장실 조명이 깜빡여요"
              className="w-full border border-[#F9D0D8] rounded-lg p-2.5 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#E05C7A]"
            />
            <button onClick={submit} className="mt-3 w-full bg-[#E05C7A] text-white rounded-lg py-2.5 text-sm font-semibold">
              제출
            </button>
            <div className="text-[11px] text-slate-400 mt-2 text-center">제출하면 운영자에게 즉시 전달됩니다 →</div>
          </div>
        </div>
      )}

      {roomPickerOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold text-slate-800">내 방 선택하기</div>
              <button onClick={() => setRoomPickerOpen(false)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="text-xs text-slate-400 mb-3">여성동 객실만 표시됩니다 · {formatRoomDeadline()}까지 변경 가능</div>
            <div className="space-y-2">
              {ROOM_MASTER.filter(r => r.no.startsWith("1")).map(r => {
                const previewCount = r.no === "101" ? 1 : r.no === "103" ? 2 : 0;
                const full = previewCount >= r.capacity;
                return (
                  <button
                    key={r.no}
                    disabled={full}
                    onClick={() => { onPickRoom(r.no); setRoomPickerOpen(false); }}
                    className={`w-full text-left rounded-xl p-3 ring-1 ${full ? "bg-[#FFF7F9] ring-[#F9D0D8] opacity-50 cursor-not-allowed" : "bg-white ring-[#F9D0D8] hover:ring-[#E05C7A]"}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-slate-700">{r.no}호</div>
                      <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-1.5 py-0.5 rounded">여성동 {r.floor}층</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">정원 {r.capacity}명 · {full ? "마감" : `${r.capacity - previewCount}자리 남음`}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Room Assignment ----------
const ROOM_MASTER = [
  { no: "101", floor: 1, capacity: 2 },
  { no: "102", floor: 1, capacity: 2 },
  { no: "103", floor: 1, capacity: 4 },
  { no: "104", floor: 1, capacity: 4 },
  { no: "201", floor: 2, capacity: 2 },
  { no: "202", floor: 2, capacity: 2 },
  { no: "203", floor: 2, capacity: 4 },
  { no: "204", floor: 2, capacity: 4 },
];

const STUDENT_ROSTER = [
  { id: 0, name: "교육생 1교시", gender: "F", team: "1조" }, // 본인(데모 로그인 계정)
  { id: 1, name: "김도윤", gender: "M", team: "1조" },
  { id: 2, name: "이서준", gender: "M", team: "1조" },
  { id: 3, name: "박지호", gender: "M", team: "1조" },
  { id: 4, name: "최민재", gender: "M", team: "2조" },
  { id: 5, name: "정우진", gender: "M", team: "2조" },
  { id: 6, name: "강현우", gender: "M", team: "2조" },
  { id: 7, name: "조성민", gender: "M", team: "3조" },
  { id: 8, name: "윤태양", gender: "M", team: "3조" },
  { id: 9, name: "한지민", gender: "F", team: "1조" },
  { id: 10, name: "오서연", gender: "F", team: "1조" },
  { id: 11, name: "신유나", gender: "F", team: "1조" },
  { id: 12, name: "임채원", gender: "F", team: "2조" },
  { id: 13, name: "황수아", gender: "F", team: "2조" },
  { id: 14, name: "배은서", gender: "F", team: "3조" },
  { id: 15, name: "송하은", gender: "F", team: "3조" },
  { id: 16, name: "權지안", gender: "F", team: "3조" },
  { id: 17, name: "문승현", gender: "M", team: "3조" },
  { id: 18, name: "장도현", gender: "M", team: "4조" },
  { id: 19, name: "노예린", gender: "F", team: "4조" },
  { id: 20, name: "구민준", gender: "M", team: "4조" },
];

// 객실 신청기간 — 마감 전: 본인선택, 마감 후: 운영자 자동배정
const ROOM_APPLICATION_DEADLINE = new Date("2026-07-03T18:00:00");
function roomApplicationPassed() { return new Date() > ROOM_APPLICATION_DEADLINE; }
function formatRoomDeadline() {
  const d = ROOM_APPLICATION_DEADLINE;
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]}) 18:00 마감`;
}

// rule-based greedy bin-packing: 성별 분리(고정) + 같은 조 우선 배치(옵션)
// locked: { studentId: roomNo } — 본인이 신청기간 내 직접 선택한 객실 (고정, 재배정 대상에서 제외)
function autoAssignRooms(students, rooms, groupByTeam, locked = {}) {
  const roomState = rooms.map(r => ({ ...r, gender: null, occupants: [] }));
  const unassigned = [];

  // 1) 본인선택(locked) 먼저 고정 배치
  Object.entries(locked).forEach(([studentId, roomNo]) => {
    const student = students.find(s => s.id === Number(studentId));
    const room = roomState.find(r => r.no === roomNo);
    if (student && room && room.occupants.length < room.capacity) {
      if (!room.gender) room.gender = student.gender;
      room.occupants.push({ ...student, selfPicked: true });
    }
  });

  const lockedIds = new Set(Object.keys(locked).map(Number));
  const remainingStudents = students.filter(s => !lockedIds.has(s.id));

  // 2) 나머지 인원 자동배정
  ["F", "M"].forEach(g => {
    let pool = remainingStudents.filter(s => s.gender === g);
    if (groupByTeam) pool = [...pool].sort((a, b) => a.team.localeCompare(b.team));
    pool.forEach(s => {
      let room = null;
      if (groupByTeam) {
        room = roomState.find(r => r.gender === g && r.occupants.length < r.capacity && r.occupants.some(o => o.team === s.team));
      }
      if (!room) room = roomState.find(r => r.gender === g && r.occupants.length < r.capacity);
      if (!room) {
        room = roomState.find(r => r.gender === null && r.occupants.length < r.capacity);
        if (room) room.gender = g;
      }
      if (room) room.occupants.push(s);
      else unassigned.push(s);
    });
  });
  return { roomState, unassigned };
}

function RoomAssignPanel({ myRoomChoice }) {
  const [groupByTeam, setGroupByTeam] = useState(true);
  const [result, setResult] = useState(null);
  const [moving, setMoving] = useState(null); // student id being relocated

  function run() {
    const locked = myRoomChoice ? { 0: myRoomChoice } : {};
    setResult(autoAssignRooms(STUDENT_ROSTER, ROOM_MASTER, groupByTeam, locked));
    setMoving(null);
  }

  function moveStudent(roomNo) {
    if (!moving || !result) return;
    setResult(prev => {
      const roomState = prev.roomState.map(r => ({ ...r, occupants: [...r.occupants] }));
      let student = null;
      roomState.forEach(r => {
        const idx = r.occupants.findIndex(o => o.id === moving);
        if (idx >= 0) { student = r.occupants[idx]; r.occupants.splice(idx, 1); }
      });
      let unassigned = prev.unassigned.filter(s => s.id !== moving);
      if (!student) {
        student = prev.unassigned.find(s => s.id === moving);
      }
      const target = roomState.find(r => r.no === roomNo);
      if (target && student && target.occupants.length < target.capacity && (target.gender === null || target.gender === student.gender)) {
        if (target.gender === null) target.gender = student.gender;
        target.occupants.push(student);
      } else if (student) {
        unassigned = [...unassigned, student];
      }
      return { roomState, unassigned };
    });
    setMoving(null);
  }

  const totalAssigned = result ? result.roomState.reduce((s, r) => s + r.occupants.length, 0) : 0;

  return (
    <div className="p-6 w-full overflow-y-auto">
      <Eyebrow>객실배정</Eyebrow>
      <div className="text-sm text-slate-500 mb-3">규칙 기반 자동배정 — 성별 분리(고정) + 같은 조 우선배치(옵션)</div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">
          <Lock size={12} /> 성별 분리 배정 (고정 규칙)
        </div>
        <button
          onClick={() => setGroupByTeam(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ${groupByTeam ? "bg-[#E05C7A] text-white ring-[#E05C7A]" : "bg-white text-slate-500 ring-[#F9D0D8]"}`}>
          {groupByTeam ? <Check size={12} /> : null} 같은 조 우선배치
        </button>
        <button onClick={run} className="ml-auto bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
          자동배정 실행
        </button>
      </div>

      {!result && (
        <div className="text-sm text-slate-400 bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl p-6 text-center">
          명단 {STUDENT_ROSTER.length}명 · 객실 {ROOM_MASTER.length}개 (정원 {ROOM_MASTER.reduce((s, r) => s + r.capacity, 0)}명) 로드됨<br />
          {myRoomChoice ? `본인선택 1명(${myRoomChoice}호) 확정 · ` : ""}
          신청기간({formatRoomDeadline()}) 동안은 본인선택, 마감 후 남은 인원만 아래 버튼으로 자동배정하세요.
        </div>
      )}

      {result && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { l: "전체 인원", v: STUDENT_ROSTER.length },
              { l: "배정 완료", v: totalAssigned },
              { l: "미배정", v: result.unassigned.length },
              { l: "사용 객실", v: `${result.roomState.filter(r => r.occupants.length > 0).length}/${ROOM_MASTER.length}` },
            ].map((k, i) => (
              <div key={i} className="bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl p-3">
                <div className="text-[11px] text-slate-400">{k.l}</div>
                <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{k.v}</div>
              </div>
            ))}
          </div>

          {moving && (
            <div className="flex items-center gap-2 bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-xs rounded-lg px-3 py-2 mb-3">
              <Sparkles size={13} /> 이동할 객실을 클릭하세요 (성별이 맞고 자리가 있는 객실만 이동 가능)
              <button onClick={() => setMoving(null)} className="ml-auto underline">취소</button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {result.roomState.map(r => {
              const full = r.occupants.length >= r.capacity;
              const canDropHere = moving && (r.gender === null || r.gender === STUDENT_ROSTER.find(s => s.id === moving)?.gender) && !full;
              return (
                <div
                  key={r.no}
                  onClick={() => moving && canDropHere && moveStudent(r.no)}
                  className={`rounded-xl ring-1 p-3 transition-all ${
                    moving ? (canDropHere ? "ring-amber-400 bg-amber-50 cursor-pointer" : "ring-[#F9D0D8] opacity-40") :
                    "ring-[#F9D0D8] bg-[#FFF7F9]"
                  }`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="font-mono text-sm font-bold text-slate-700">{r.no}호</div>
                    {r.gender && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.gender === "F" ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600"}`}>
                        {r.gender === "F" ? "여" : "남"}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2">{r.floor}층 · 정원 {r.capacity}명</div>
                  <div className="space-y-1">
                    {r.occupants.map(o => (
                      <button
                        key={o.id}
                        onClick={(e) => { e.stopPropagation(); if (!o.selfPicked) setMoving(o.id === moving ? null : o.id); }}
                        disabled={o.selfPicked}
                        className={`w-full text-left text-[11px] px-2 py-1 rounded flex items-center justify-between ${
                          o.id === moving ? "bg-[#E05C7A] text-white" :
                          o.selfPicked ? "bg-amber-50 ring-1 ring-amber-200 text-amber-700 cursor-default" :
                          "bg-white ring-1 ring-[#F9D0D8] text-slate-600"
                        }`}>
                        <span>{o.name} <span className="text-[9px] opacity-60">{o.team}</span></span>
                        {o.selfPicked && <span className="text-[8px] font-bold">본인선택</span>}
                      </button>
                    ))}
                    {[...Array(r.capacity - r.occupants.length)].map((_, i) => (
                      <div key={i} className="text-[11px] px-2 py-1 rounded border border-dashed border-[#F9D0D8] text-slate-300">빈 자리</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {result.unassigned.length > 0 && (
            <div className="mt-4">
              <Eyebrow tone="ink">미배정 인원 ({result.unassigned.length}명) — 클릭 후 객실 선택</Eyebrow>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.unassigned.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setMoving(s.id === moving ? null : s.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ${s.id === moving ? "bg-[#E05C7A] text-white ring-[#E05C7A]" : "bg-rose-50 text-rose-600 ring-rose-200"}`}>
                    {s.name} ({s.gender === "F" ? "여" : "남"}·{s.team})
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------- Operator view ----------
function OperatorView({ requests, onAdvance, checkedIn, idIssued, issuedAt, onIssueId, focusRequest, clearFocus, busReservations, myRoomChoice }) {
  const [tab, setTab] = useState("facility");
  const [selected, setSelected] = useState(null);
  const [scanBus, setScanBus] = useState(null);
  const [scanned, setScanned] = useState({});

  React.useEffect(() => {
    if (!focusRequest) return;
    setTab(focusRequest.type);
    const found = requests.find((r) => r.id === focusRequest.id);
    if (found) setSelected(found);
    clearFocus();
  }, [focusRequest]); // eslint-disable-line react-hooks/exhaustive-deps

  const navItems = [
    { key: "assign", label: "객실배정", icon: ClipboardList },
    { key: "change", label: "객실변경", icon: Repeat2, badge: requests.filter(r => r.type === "roomchange" && r.status === "접수").length },
    { key: "checkinout", label: "입퇴실", icon: LogIn, badge: idIssued ? 0 : 1 },
    { key: "facility", label: "시설관리", icon: Wrench, badge: requests.filter(r => r.type === "facility" && r.status === "접수").length },
    { key: "bus", label: "버스관리", icon: Bus },
  ];

  const list = useMemo(() => {
    if (tab === "facility") return requests.filter((r) => r.type === "facility");
    if (tab === "change") return requests.filter((r) => r.type === "roomchange");
    return [];
  }, [tab, requests]);

  const nextStatus = { "접수": "처리중", "처리중": "완료" };

  return (
    <div className="flex bg-white rounded-2xl ring-1 ring-[#F9D0D8] overflow-hidden" style={{ height: 560 }}>
      <div className="w-20 bg-[#E05C7A] flex flex-col items-center py-4 gap-1">
        {navItems.map((it) => {
          const Icon = it.icon;
          const isActive = tab === it.key;
          return (
            <button
              key={it.key}
              onClick={() => { setTab(it.key); setSelected(null); }}
              className={`relative flex flex-col items-center gap-1 w-full py-3 text-[10px] ${isActive ? "bg-white/10 text-white" : "text-[#F4A7B3]"}`}
            >
              <span className="relative">
                <Icon size={18} />
                {!!it.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {it.badge}
                  </span>
                )}
              </span>
              {it.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex">
        {(tab === "facility" || tab === "change") && (
          <>
            <div className="w-72 border-r border-[#F9D0D8] overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#F9D0D8]">
                <Eyebrow>{tab === "facility" ? "시설관리 · 처리함" : "객실변경 · 처리함"}</Eyebrow>
                <div className="text-xs text-slate-400">{list.length}건 · 미완료 {list.filter(r=>r.status!=="완료").length}건</div>
              </div>
              {list.length === 0 && <div className="p-4 text-sm text-slate-400">접수된 요청이 없습니다.</div>}
              {list.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-[#FFF7F9] ${selected?.id === r.id ? "bg-[#FFF7F9]" : ""}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-sm font-medium text-slate-700 line-clamp-2">{r.title}</div>
                    {r.urgent && <span className="shrink-0 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">긴급</span>}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400 font-mono">{r.room}호 · {r.time}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex-1 p-6">
              {!selected && (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  왼쪽에서 항목을 선택하세요
                </div>
              )}
              {selected && (
                <div>
                  <Eyebrow tone="ink">{selected.room}호 · {selected.time} 접수</Eyebrow>
                  <div className="text-lg font-semibold text-slate-800 mt-1">{selected.title}</div>
                  <div className="mt-3"><StatusBadge status={selected.status} /></div>
                  <div className="mt-6 text-sm text-slate-500 leading-relaxed">
                    교육생이 모바일에서 직접 등록한 요청입니다. 처리 단계를 진행하면 교육생 화면과 관리자 대시보드에 즉시 반영됩니다.
                  </div>
                  {nextStatus[selected.status] && (
                    <button
                      onClick={() => { onAdvance(selected.id); setSelected({ ...selected, status: nextStatus[selected.status] }); }}
                      className="mt-6 inline-flex items-center gap-2 bg-[#E05C7A] text-white rounded-lg px-4 py-2.5 text-sm font-semibold"
                    >
                      {nextStatus[selected.status]}으로 변경 <ChevronRight size={16} />
                    </button>
                  )}
                  {selected.status === "완료" && (
                    <div className="mt-6 inline-flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                      <Check size={16} /> 처리 완료됨 · 교육생에게 결과가 자동 통보되었습니다
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "assign" && <RoomAssignPanel myRoomChoice={myRoomChoice} />}

        {tab === "checkinout" && (
          <div className="p-6 w-full">
            <Eyebrow>입·퇴실 현황</Eyebrow>

            {!idIssued && (
              <div className="flex items-center justify-between bg-amber-50 ring-1 ring-amber-200 rounded-xl px-4 py-3 mt-2 mb-3">
                <div className="flex items-center gap-3">
                  <UserPlus size={18} className="text-amber-700" />
                  <div>
                    <div className="text-sm font-semibold text-amber-800">신규 입소자 · 학생증 미발급</div>
                    <div className="text-xs text-amber-600">215호 · 교육생 1교시 — 입소 확인 후 발급해주세요</div>
                  </div>
                </div>
                <button onClick={onIssueId} className="bg-[#E05C7A] text-white text-xs font-semibold px-3 py-2 rounded-lg">
                  학생증 발급
                </button>
              </div>
            )}

            <div className="flex items-center justify-between bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl px-4 py-3 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E05C7A] text-white flex items-center justify-center text-xs font-bold">215</div>
                <div>
                  <div className="text-sm font-semibold text-slate-700">교육생 1교시</div>
                  <div className="text-xs text-slate-400">
                    {idIssued ? `학생증 발급됨 · ${issuedAt}` : "학생증 미발급 — 체크인 불가"}
                  </div>
                </div>
              </div>
              <StatusBadge status={checkedIn ? "완료" : "접수"} />
            </div>
            <div className="text-xs text-slate-400 mt-3">※ 학생 QR 탭에서 체크인하면 이 화면에 실시간으로 반영됩니다.</div>
          </div>
        )}

        {tab === "bus" && (
          <div className="p-6 w-full overflow-y-auto">
            <Eyebrow>버스관리</Eyebrow>
            {scanBus ? (
              <div className="flex flex-col items-center gap-4 mt-4">
                <div className="text-sm font-semibold text-slate-700">{scanBus.label} · {scanBus.time} 탑승 확인</div>
                <div className="w-full space-y-2 max-h-72 overflow-y-auto">
                  {(busReservations[scanBus.id] || []).map((student, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-lg px-4 py-2.5">
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{student.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{student.room}호 · {student.code}{student.seat ? ` · ${student.seat}석` : ""}</div>
                      </div>
                      <button
                        onClick={() => setScanned(prev => ({ ...prev, [scanBus.id + "_" + i]: true }))}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${scanned[scanBus.id + "_" + i] ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-[#E05C7A] text-white"}`}>
                        {scanned[scanBus.id + "_" + i] ? "✓ 탑승확인" : "QR 스캔"}
                      </button>
                    </div>
                  ))}
                  {(busReservations[scanBus.id] || []).length === 0 &&
                    <div className="text-sm text-slate-400 text-center py-6">예약자가 없습니다.</div>}
                </div>
                <div className="text-xs text-slate-400">
                  확인 {Object.keys(scanned).filter(k=>k.startsWith(scanBus.id)).length} / {(busReservations[scanBus.id]||[]).length}명
                </div>
                <button onClick={() => setScanBus(null)} className="text-sm text-slate-400 underline">← 목록으로</button>
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                {["arrival", "departure"].map(type => (
                  <div key={type}>
                    <div className="text-xs font-semibold text-slate-400 mb-2">{type === "arrival" ? "▶ 입소 버스" : "▶ 퇴소 버스"}</div>
                    {BUS_SCHEDULE[type].map(bus => {
                      const passed = deadlinePassed(bus, type);
                      const dlText = formatDeadline(bus, type);
                      const count = (busReservations[bus.id] || []).length;
                      return (
                        <div key={bus.id} className="bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl px-4 py-3 mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-semibold text-slate-700">{bus.date} {bus.time}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{bus.from || bus.to}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#E05C7A]">{count}명 예약</div>
                              <div className={`text-[11px] mt-0.5 ${passed ? "text-rose-500" : "text-slate-400"}`}>{dlText}</div>
                            </div>
                          </div>
                          <button onClick={() => setScanBus({ ...bus, type })}
                            className="mt-2 w-full text-xs font-semibold bg-[#E05C7A] text-white rounded-lg py-2 flex items-center justify-center gap-1.5">
                            <ScanLine size={13} /> 탑승 확인 시작
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Admin view ----------
function AdminView({ requests, checkedIn }) {
  const [tab, setTab] = useState("status");
  const navItems = [
    { key: "status", label: "운영현황", icon: Activity },
    { key: "stats", label: "통계", icon: BarChart3 },
    { key: "kpi", label: "KPI", icon: Target },
    { key: "report", label: "보고서", icon: FileText },
  ];

  const completed = requests.filter((r) => r.status === "완료").length;
  const inProgress = requests.filter((r) => r.status !== "완료").length;
  const occupied = 86 + (checkedIn ? 1 : 0);
  const total = 120;

  return (
    <div className="bg-white rounded-2xl ring-1 ring-[#F9D0D8] p-6" style={{ minHeight: 560 }}>
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-full p-1 w-fit">
        {navItems.map((it) => {
          const Icon = it.icon; const active = tab === it.key;
          return (
            <button key={it.key} onClick={() => setTab(it.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${active ? "bg-[#E05C7A] text-white" : "text-slate-500"}`}>
              <Icon size={14} /> {it.label}
            </button>
          );
        })}
      </div>

      {tab === "status" && (
        <div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { l: "입소율", v: `${Math.round(occupied/total*100)}%`, s: `${occupied}/${total}명` },
              { l: "금일 처리건", v: completed, s: "완료 기준" },
              { l: "진행중", v: inProgress, s: "대기·처리중" },
              { l: "긴급건", v: requests.filter(r=>r.urgent && r.status!=="완료").length, s: "즉시 대응 필요" },
            ].map((k, i) => (
              <div key={i} className="bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl p-4">
                <div className="text-xs text-slate-400">{k.l}</div>
                <div className="text-2xl font-bold text-slate-800 font-mono mt-1">{k.v}</div>
                <div className="text-[11px] text-slate-400 mt-1">{k.s}</div>
              </div>
            ))}
          </div>
          <Eyebrow tone="ink">최근 처리 현황</Eyebrow>
          <div className="space-y-2 mt-2">
            {requests.map((r) => (
              <div key={r.id} className="flex justify-between items-center text-sm bg-[#FFF7F9] rounded-lg px-3 py-2">
                <span className="text-slate-600">{r.room}호 · {r.title}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "stats" && (
        <div>
          <Eyebrow tone="ink">주간 신고·요청 처리 추이</Eyebrow>
          <div style={{ height: 260 }} className="mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F9D0D8" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#E05C7A" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "kpi" && (
        <div>
          <Eyebrow tone="ink">핵심 운영 지표 (KPI)</Eyebrow>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              {
                label: "당일 처리 완료율",
                value: requests.length ? `${Math.round(completed / requests.length * 100)}%` : "0%",
                target: "목표 90% 이상",
                ok: requests.length ? (completed / requests.length) >= 0.9 : true,
                formula: "당일 완료 건수 ÷ 당일 접수 건수",
              },
              {
                label: "평균 처리시간",
                value: "2.4시간",
                target: "목표 2.0시간 이하",
                ok: false,
                formula: "접수~완료 소요시간 평균 (최근 7일, 예시값)",
              },
              {
                label: "동일 민원 재문의율",
                value: "6%",
                target: "목표 5% 이하",
                ok: false,
                formula: "처리완료 후 동일 사유 재신고 비율 (예시값)",
              },
              {
                label: "입소율",
                value: `${Math.round(occupied/total*100)}%`,
                target: `${occupied}/${total}명 기준`,
                ok: true,
                formula: "체크인 인원 ÷ 전체 정원",
              },
            ].map((k, i) => (
              <div key={i} className="bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">{k.label}</div>
                  {k.ok
                    ? <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><TrendingUp size={13}/> 목표 충족</span>
                    : <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600"><TrendingDown size={13}/> 관찰 필요</span>}
                </div>
                <div className="text-2xl font-bold text-slate-800 font-mono mt-1">{k.value}</div>
                <div className="text-[11px] text-slate-500 mt-1">{k.target}</div>
                <div className="text-[10px] text-slate-400 mt-2 border-t border-[#F9D0D8] pt-2">{k.formula}</div>
              </div>
            ))}
          </div>

          <Eyebrow tone="ink">현행(100) 대비 목표 — 종합 비교</Eyebrow>
          <div style={{ height: 240 }} className="mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiCompareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F9D0D8" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} ticks={[0,25,50,75,100]} allowDataOverflow />
                <Tooltip />
                <Bar dataKey="before" name="현행" fill="#CBD5C9" radius={[4,4,0,0]} isAnimationActive={false} />
                <Bar dataKey="after" name="목표" fill="#3E8E76" radius={[4,4,0,0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">※ 평균 처리시간·재문의율은 시범운영 데이터 확보 후 실측값으로 교체 필요</div>
        </div>
      )}

      {tab === "report" && (
        <div>
          <Eyebrow tone="ink">자동 생성 보고서 미리보기</Eyebrow>
          <div className="bg-[#FFF7F9] ring-1 ring-[#F9D0D8] rounded-xl p-5 mt-3 text-sm text-slate-600 leading-relaxed font-mono">
            <div className="text-slate-800 font-bold mb-2">2026-06-29 일일 운영 보고</div>
            · 금일 접수 {requests.length}건 / 완료 {completed}건 / 진행중 {inProgress}건<br/>
            · 입소율 {Math.round(occupied/total*100)}% ({occupied}/{total}명)<br/>
            · 긴급 미처리 {requests.filter(r=>r.urgent && r.status!=="완료").length}건<br/>
            · 전 항목은 운영자 처리 내역에서 자동 집계됨 (수기 작성 불필요)
          </div>
          <div className="text-xs text-slate-400 mt-2">※ 실제 운영 시 일/주/월 단위로 자동 발행되며 PDF·Excel로 추출됩니다.</div>
        </div>
      )}
    </div>
  );
}

export default function SmartCampusPrototype() {
  const [role, setRole] = useState("student");
  const [requests, setRequests] = useState(seedRequests);
  const [checkedIn, setCheckedIn] = useState(false);
  const [hintOpen, setHintOpen] = useState(true);
  const [idIssued, setIdIssued] = useState(false);
  const [issuedAt, setIssuedAt] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [pendingFocus, setPendingFocus] = useState(null);
  // busReservation: { [busId]: boolean } — student's own reservations
  const [busReservation, setBusReservation] = useState({});
  // busReservations: { [busId]: [{name, room, code}] } — all reservations for operator
  const [busReservations, setBusReservations] = useState({ a1: [], a2: [], d1: [], d2: [], d3: [] });
  const [myRoomChoice, setMyRoomChoice] = useState(null);

  function handlePickRoom(roomNo) {
    setMyRoomChoice(roomNo);
    pushToast(`${roomNo}호를 선택했습니다 →`);
  }

  function handleBusReserve(busId, type, seat) {
    setBusReservation(prev => ({ ...prev, [busId]: { seat } }));
    setBusReservations(prev => ({
      ...prev,
      [busId]: [...(prev[busId] || []), { name: "교육생 1교시", room: "215", code: "26-0612", seat }],
    }));
    pushToast(`${seat}석 버스 예약이 완료되었습니다 →`);
  }

  function handleBusCancel(busId) {
    setBusReservation(prev => { const n = { ...prev }; delete n[busId]; return n; });
    setBusReservations(prev => ({
      ...prev,
      [busId]: (prev[busId] || []).filter(s => s.code !== "26-0612"),
    }));
    pushToast("예약이 취소되었습니다.");
  }

  function pushToast(text) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }

  function pushNotification({ toRole, text, requestId, reqType }) {
    setNotifications((prev) => [
      { id: Date.now() + Math.random(), role: toRole, text, time: new Date().toTimeString().slice(0,5), read: false, requestId, reqType },
      ...prev,
    ]);
  }

  function handleSubmit({ type, title, room }) {
    const id = Date.now();
    setRequests((prev) => [
      { id, type, title, room, time: new Date().toTimeString().slice(0,5), status: "접수", urgent: false },
      ...prev,
    ]);
    pushNotification({
      toRole: "operator",
      text: `새 ${type === "facility" ? "시설신고" : "객실변경"} 접수 · ${room}호 — ${title}`,
      requestId: id,
      reqType: type,
    });
    pushToast("운영자에게 즉시 전달되었습니다 →");
  }

  function handleAdvance(id) {
    let justCompleted = null;
    let updated = null;
    setRequests((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const next = r.status === "접수" ? "처리중" : "완료";
      updated = { ...r, status: next };
      if (next === "완료") justCompleted = updated;
      return updated;
    }));
    if (justCompleted) {
      pushNotification({
        toRole: "admin",
        text: `처리완료 · ${justCompleted.room}호 — ${justCompleted.title}`,
        requestId: justCompleted.id,
        reqType: justCompleted.type,
      });
    }
  }

  function handleIssueId() {
    const now = new Date();
    const stamp = `${now.getMonth()+1}/${now.getDate()} ${now.toTimeString().slice(0,5)}`;
    setIdIssued(true);
    setIssuedAt(stamp);
    pushToast("학생증이 발급되어 교육생 화면에 즉시 반영되었습니다 →");
  }

  function openNotification(n) {
    setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
    setBellOpen(false);
    setRole(n.role);
    if (n.requestId) setPendingFocus({ type: n.reqType, id: n.requestId });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles = [
    { key: "student", label: "교육생" },
    { key: "operator", label: "운영자" },
    { key: "admin", label: "관리자" },
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-[#C0425E] font-semibold">SMART CAMPUS DX</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">연수원 통합 운영 플랫폼 · 클릭형 프로토타입</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative w-10 h-10 rounded-full bg-white ring-1 ring-[#F9D0D8] flex items-center justify-center text-slate-600"
              >
                {unreadCount > 0 ? <BellRing size={18} className="text-amber-600" /> : <Bell size={18} />}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl ring-1 ring-[#F9D0D8] overflow-hidden z-40">
                  <div className="px-4 py-2.5 border-b border-[#F9D0D8] text-xs font-semibold text-slate-500">알림</div>
                  {notifications.length === 0 && <div className="px-4 py-6 text-sm text-slate-400 text-center">알림이 없습니다</div>}
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => openNotification(n)}
                        className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-[#FFF7F9] ${!n.read ? "bg-amber-50/50" : ""}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-semibold text-slate-400">{n.role === "operator" ? "운영자" : "관리자"} 알림</span>
                          <span className="text-[11px] text-slate-300 font-mono">{n.time}</span>
                        </div>
                        <div className="text-sm text-slate-700 mt-0.5">{n.text}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex bg-white ring-1 ring-[#F9D0D8] rounded-full p-1">
              {roles.map((r) => (
                <button key={r.key} onClick={() => setRole(r.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${role === r.key ? "bg-[#E05C7A] text-white" : "text-slate-500"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hintOpen && (
          <div className="flex items-start gap-2 bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-6">
            <Sparkles size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <b>교육생 → 버스</b> 탭에서 버스 예약 후, <b>운영자 → 버스관리</b>에서 예약 현황과 탑승 확인을 해보세요.
              신고·알림 흐름은 교육생 화면에서 시설신고 후 우측 상단 <b>알림 벨</b>로 확인하세요.
            </div>
            <button onClick={() => setHintOpen(false)}><X size={14} /></button>
          </div>
        )}

        {role === "student" && (
          <StudentView
            requests={requests}
            onSubmit={handleSubmit}
            checkedIn={checkedIn}
            onToggleCheckin={() => setCheckedIn((v) => !v)}
            idIssued={idIssued}
            issuedAt={issuedAt}
            busReservation={busReservation}
            onBusReserve={handleBusReserve}
            onBusCancel={handleBusCancel}
            myRoomChoice={myRoomChoice}
            onPickRoom={handlePickRoom}
          />
        )}
        {role === "operator" && (
          <OperatorView
            requests={requests}
            onAdvance={handleAdvance}
            checkedIn={checkedIn}
            idIssued={idIssued}
            issuedAt={issuedAt}
            onIssueId={handleIssueId}
            focusRequest={pendingFocus}
            clearFocus={() => setPendingFocus(null)}
            busReservations={busReservations}
            myRoomChoice={myRoomChoice}
          />
        )}
        {role === "admin" && (
          <AdminView requests={requests} checkedIn={checkedIn} />
        )}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-[#E05C7A] text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

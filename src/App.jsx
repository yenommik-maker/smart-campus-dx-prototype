import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Bus,
  BedDouble,
  Utensils,
  Wrench,
  QrCode,
  MonitorSmartphone,
  Users,
  ClipboardCheck,
  CalendarDays,
  Smartphone,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Settings,
  FileText,
  UserCog,
  Home,
  MapPin,
  Clock,
  RotateCcw,
  Check,
  X,
} from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const roles = [
  {
    id: "admin",
    name: "관리자",
    team: "Smart Access",
    desc: "사용자·권한·기준정보·로그 관리",
    icon: ShieldCheck,
    color: "bg-slate-900",
  },
  {
    id: "team1",
    name: "1팀 과정 담당자",
    team: "과정 운영",
    desc: "담당 과정 버스, 공지, 교육생 안내",
    icon: ClipboardCheck,
    color: "bg-[#173F4F]",
  },
  {
    id: "room",
    name: "2팀 객실 담당자",
    team: "Smart Room",
    desc: "신청기간 관리, 4인실 자동배정, 수동조정",
    icon: BedDouble,
    color: "bg-teal-700",
  },
  {
    id: "meal",
    name: "2팀 식당 담당자",
    team: "Smart Meal",
    desc: "식수 인원, 식단, 식사 확인",
    icon: Utensils,
    color: "bg-orange-600",
  },
  {
    id: "facility",
    name: "3팀 시설 담당자",
    team: "Smart Facility",
    desc: "전기·소방·안전·통신 신고 처리",
    icon: Wrench,
    color: "bg-indigo-700",
  },
  {
    id: "escort",
    name: "버스 인솔자",
    team: "현장 확인",
    desc: "담당 차량 QR/이름검색 탑승확인",
    icon: QrCode,
    color: "bg-emerald-700",
  },
  {
    id: "student",
    name: "교육생",
    team: "Smart Portal",
    desc: "모바일 학생증, 버스·객실 신청, 공지 확인",
    icon: Smartphone,
    color: "bg-sky-700",
  },
];

const learnersSeed = [
  { id: "S-001", name: "교육생01", gender: "남", region: "광주전남", age: 31, rank: "주임", dept: "광주지역본부", roomRequest: "동일객실: 교육생02", bus: "광주송정역", seat: "12A", boarded: true, meal: true },
  { id: "S-002", name: "교육생02", gender: "남", region: "광주전남", age: 32, rank: "주임", dept: "광주지역본부", roomRequest: "동일객실: 교육생01", bus: "광주송정역", seat: "12B", boarded: true, meal: true },
  { id: "S-003", name: "교육생03", gender: "남", region: "부산경남", age: 42, rank: "대리", dept: "부산울산경남본부", roomRequest: "", bus: "부산역", seat: "04A", boarded: false, meal: false },
  { id: "S-004", name: "교육생04", gender: "남", region: "부산경남", age: 45, rank: "과장", dept: "부산울산경남본부", roomRequest: "", bus: "부산역", seat: "04B", boarded: false, meal: true },
  { id: "S-005", name: "교육생05", gender: "여", region: "대전충청", age: 29, rank: "주임", dept: "대전세종충청본부", roomRequest: "저층 희망", bus: "대전역", seat: "09A", boarded: true, meal: true },
  { id: "S-006", name: "교육생06", gender: "여", region: "대전충청", age: 30, rank: "주임", dept: "대전세종충청본부", roomRequest: "", bus: "대전역", seat: "09B", boarded: true, meal: false },
  { id: "S-007", name: "교육생07", gender: "여", region: "서울강원", age: 38, rank: "대리", dept: "서울강원본부", roomRequest: "건강상 사유: 엘리베이터 인접", bus: "서울역", seat: "15A", boarded: false, meal: true },
  { id: "S-008", name: "교육생08", gender: "여", region: "서울강원", age: 40, rank: "과장", dept: "서울강원본부", roomRequest: "", bus: "서울역", seat: "15B", boarded: false, meal: true },
  { id: "S-009", name: "교육생09", gender: "남", region: "광주전남", age: 35, rank: "대리", dept: "광주지역본부", roomRequest: "", bus: "자차", seat: "-", boarded: false, meal: false },
  { id: "S-010", name: "교육생10", gender: "여", region: "부산경남", age: 34, rank: "대리", dept: "부산울산경남본부", roomRequest: "동일객실: 교육생11", bus: "부산역", seat: "05A", boarded: true, meal: true },
  { id: "S-011", name: "교육생11", gender: "여", region: "부산경남", age: 35, rank: "대리", dept: "부산울산경남본부", roomRequest: "동일객실: 교육생10", bus: "부산역", seat: "05B", boarded: true, meal: true },
  { id: "S-012", name: "교육생12", gender: "남", region: "대전충청", age: 50, rank: "차장", dept: "대전세종충청본부", roomRequest: "", bus: "대전역", seat: "10A", boarded: false, meal: false },
];

const facilitySeed = [
  { id: 1, field: "통신", title: "생활관 3층 Wi-Fi 불안정", place: "생활관 312호", status: "접수", owner: "3팀 통신", time: "09:20" },
  { id: 2, field: "전기", title: "강의동 콘센트 불량", place: "강의실 A-201", status: "처리중", owner: "3팀 전기", time: "10:05" },
  { id: 3, field: "안전", title: "계단 미끄럼 주의 표시 필요", place: "식당 앞 계단", status: "완료", owner: "3팀 안전", time: "11:10" },
  { id: 4, field: "소방", title: "소화기 위치 안내문 훼손", place: "생활관 2층", status: "접수", owner: "3팀 소방", time: "13:40" },
];

const busRoutesSeed = [
  { id: "B-ARR-GJ-1", type: "입소", route: "광주송정역", time: "09:30", vehicle: "1호차", seats: 45, reserved: 31, boarded: 24, manager: "1팀 과정 담당" },
  { id: "B-ARR-BS-1", type: "입소", route: "부산역", time: "08:40", vehicle: "2호차", seats: 45, reserved: 28, boarded: 19, manager: "1팀 과정 담당" },
  { id: "B-DEP-GJ-1", type: "퇴소", route: "광주송정역", time: "15:30", vehicle: "1호차", seats: 45, reserved: 34, boarded: 0, manager: "1팀 과정 담당" },
];

const rankOrder = { 주임: 1, 대리: 2, 과장: 3, 차장: 4, 부장: 5 };

function buildRoomAssignments(learners) {
  const sorted = [...learners].sort((a, b) => {
    if (a.gender !== b.gender) return a.gender.localeCompare(b.gender, "ko");
    if (a.region !== b.region) return a.region.localeCompare(b.region, "ko");
    if (a.age !== b.age) return a.age - b.age;
    return (rankOrder[a.rank] || 99) - (rankOrder[b.rank] || 99);
  });

  const counters = { 남: 201, 여: 301 };
  return sorted.reduce((acc, learner) => {
    const sameGenderCount = acc.filter((row) => row.gender === learner.gender).length;
    const roomNo = counters[learner.gender] + Math.floor(sameGenderCount / 4);
    acc.push({ ...learner, room: `${roomNo}호` });
    return acc;
  }, []);
}

function StatCard({ label, value, hint, icon: Icon, tone = "slate" }) {
  const toneClass = {
    slate: "bg-white text-slate-900 ring-slate-200",
    teal: "bg-teal-50 text-teal-900 ring-teal-200",
    blue: "bg-sky-50 text-sky-900 ring-sky-200",
    amber: "bg-amber-50 text-amber-900 ring-amber-200",
    red: "bg-rose-50 text-rose-900 ring-rose-200",
  }[tone];
  return (
    <div className={cx("rounded-2xl p-4 ring-1 shadow-sm", toneClass)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-black tracking-tight">{value}</div>
        </div>
        {Icon && <Icon className="h-8 w-8 opacity-70" />}
      </div>
      {hint && <div className="mt-2 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function Section({ title, desc, children, action }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Badge({ children, tone = "slate" }) {
  const styles = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-100 text-teal-800",
    blue: "bg-sky-100 text-sky-800",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-rose-100 text-rose-800",
    purple: "bg-violet-100 text-violet-800",
  };
  return <span className={cx("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", styles[tone])}>{children}</span>;
}

function Header({ role, setRole }) {
  const roleMeta = roles.find((r) => r.id === role);
  const Icon = roleMeta.icon;
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173F4F] text-white shadow-sm">
            <MonitorSmartphone size={22} />
          </div>
          <div>
            <div className="text-lg font-black leading-tight text-slate-900">Smart Campus DX</div>
            <div className="text-xs text-slate-500">기존 행정프로그램 보완형 현장 운영 자동화 플랫폼</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
          <Icon size={18} className="ml-2 text-slate-500" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border-0 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-200">
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {roles.map((r) => {
        const Icon = r.icon;
        return (
          <button key={r.id} onClick={() => setRole(r.id)} className={cx(
            "rounded-3xl p-4 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md",
            role === r.id ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-900 ring-slate-200"
          )}>
            <div className="flex items-start gap-3">
              <div className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white", role === r.id ? "bg-white/20" : r.color)}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs font-bold opacity-70">{r.team}</div>
                <div className="mt-0.5 font-black">{r.name}</div>
                <div className={cx("mt-1 text-xs leading-5", role === r.id ? "text-slate-200" : "text-slate-500")}>{r.desc}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AdminView({ role, setRole, logs }) {
  const permissionRows = [
    ["1팀 과정 담당자", "버스관리, 공지관리, 교육생 안내", "담당 과정만", "조회·등록·확정·알림"],
    ["2팀 객실 담당자", "객실관리, 신청기간 설정, 자동배정", "전체 객실/담당 기간", "개시·종료·자동배정·수동조정"],
    ["2팀 식당 담당자", "식수집계, 식사확인, 식단관리", "식당 운영 데이터", "조회·수정·QR확인"],
    ["3팀 시설 담당자", "시설관리", "전기/소방/안전/통신 담당 분야", "처리상태 변경·이력작성"],
    ["버스 인솔자", "탑승확인", "배정 차량만", "QR스캔·이름검색·수동체크"],
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="사용자 역할" value="7종" hint="관리자·팀별 담당자·인솔자·교육생" icon={UserCog} tone="slate" />
        <StatCard label="권한 구조" value="3단계" hint="메뉴 · 데이터 범위 · 기능" icon={Lock} tone="teal" />
        <StatCard label="MVP 우선순위" value="Bus" hint="버스 + 권한 + QR 기본형" icon={Bus} tone="blue" />
        <StatCard label="운영 기기" value="웹/PWA" hint="데스크톱 + 모바일" icon={MonitorSmartphone} tone="amber" />
      </div>
      <Section title="Smart Access 권한관리" desc="관리자가 담당자별 화면, 데이터 범위, 처리 기능을 부여·회수합니다.">
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="p-3">역할</th><th className="p-3">메뉴 권한</th><th className="p-3">데이터 범위</th><th className="p-3">기능 권한</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionRows.map((row) => <tr key={row[0]} className="align-top"><td className="p-3 font-bold">{row[0]}</td><td className="p-3">{row[1]}</td><td className="p-3">{row[2]}</td><td className="p-3">{row[3]}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="처리 이력 로그" desc="누가, 언제, 어떤 방식으로 처리했는지 남기는 감사·책임 체계입니다.">
        <div className="grid gap-3 md:grid-cols-2">
          {logs.map((log, i) => (
            <div key={i} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between"><Badge tone={log.tone}>{log.module}</Badge><span className="text-xs text-slate-400">{log.time}</span></div>
              <div className="mt-2 font-bold text-slate-800">{log.text}</div>
              <div className="mt-1 text-xs text-slate-500">처리자: {log.user}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Team1View({ busRoutes, setBusRoutes, addLog }) {
  const [phase, setPhase] = useState("수요조사");
  const demand = { 광주송정역: 34, 부산역: 28, 대전역: 22, 자차: 11 };
  const confirmRoutes = () => {
    setPhase("노선확정");
    addLog("Smart Bus", "입소 노선 확정 및 좌석예약 오픈", "1팀 과정 담당자", "blue");
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="운영 과정" value="신임자 과정 3기" hint="담당 과정 기준 데이터만 표시" icon={ClipboardCheck} tone="slate" />
        <StatCard label="버스 신청" value="95명" hint="입소 수요조사 취합" icon={Users} tone="teal" />
        <StatCard label="미탑승" value="19명" hint="탑승확인 화면에서 실시간 확인" icon={AlertTriangle} tone="amber" />
        <StatCard label="현재 단계" value={phase} hint="수요조사 → 노선확정 → 탑승확인" icon={RotateCcw} tone="blue" />
      </div>
      <Section title="Smart Bus 4단계 운영" desc="입소 수요조사 → 입소 예약 → 퇴소 2차 조사 → 퇴소 예약·탑승확인 흐름을 시연합니다." action={<button onClick={confirmRoutes} className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">노선 확정 및 좌석예약 오픈</button>}>
        <div className="grid gap-3 md:grid-cols-4">
          {["① 입소 수요조사", "② 입소 좌석예약", "③ 퇴소 2차 조사", "④ 퇴소 탑승확인"].map((x, i) => <div key={x} className={cx("rounded-2xl p-4 ring-1", i === 0 ? "bg-teal-50 ring-teal-200" : "bg-white ring-slate-200")}><div className="font-black text-slate-800">{x}</div><div className="mt-1 text-xs text-slate-500">업무 자동 생성 및 담당자 체크</div></div>)}
        </div>
      </Section>
      <Section title="노선별 수요 및 차량 현황" desc="엑셀 취합 대신 실시간 집계 후 업체 제출 명단으로 출력합니다.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {Object.entries(demand).map(([k, v]) => <div key={k} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="flex items-center justify-between"><div className="font-bold">{k}</div><Badge tone={k === "자차" ? "slate" : "blue"}>{v}명</Badge></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-[#173F4F]" style={{ width: `${Math.min(100, v * 2)}%` }} /></div></div>)}
          </div>
          <div className="space-y-3">
            {busRoutes.map((b) => <div key={b.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><div className="flex items-start justify-between gap-2"><div><div className="font-black">{b.type} {b.route} {b.vehicle}</div><div className="text-sm text-slate-500">{b.time} · 예약 {b.reserved}/{b.seats} · 탑승 {b.boarded}</div></div><Badge tone="green">확정</Badge></div></div>)}
          </div>
        </div>
      </Section>
    </div>
  );
}

function RoomView({ learners, setRoomWindowOpen, roomWindowOpen, addLog }) {
  const assignments = useMemo(() => buildRoomAssignments(learners), [learners]);
  const [confirmed, setConfirmed] = useState(false);
  const runAssign = () => {
    setConfirmed(true);
    addLog("Smart Room", "신청기간 종료 후 4인실 자동배정 실행", "2팀 객실 담당자", "teal");
  };
  const grouped = assignments.reduce((acc, learner) => {
    acc[learner.room] = acc[learner.room] || [];
    acc[learner.room].push(learner);
    return acc;
  }, {});
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="객실 기준" value="4인실" hint="남녀 분리 필수" icon={BedDouble} tone="teal" />
        <StatCard label="신청기간" value={roomWindowOpen ? "진행중" : "종료"} hint="객실 담당자/관리자만 개시·종료" icon={CalendarDays} tone={roomWindowOpen ? "blue" : "amber"} />
        <StatCard label="자동배정 기준" value="4단계" hint="성별→지역본부→나이→직급" icon={Settings} tone="slate" />
        <StatCard label="예외요청" value="5건" hint="동일객실·건강상 사유" icon={AlertTriangle} tone="amber" />
      </div>
      <Section title="신청기간 관리" desc="교육생 객실 신청은 정해진 기간에만 열리고, 기간 종료 후 자동배정이 가능합니다." action={<div className="flex gap-2"><button onClick={() => { setRoomWindowOpen(true); addLog("Smart Room", "객실 신청기간 개시", "2팀 객실 담당자", "teal"); }} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white">신청기간 열기</button><button onClick={() => { setRoomWindowOpen(false); addLog("Smart Room", "객실 신청기간 종료", "2팀 객실 담당자", "amber"); }} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white">신청기간 종료</button></div>}>
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><div className="font-black">신임자 과정 3기 객실 신청</div><div className="text-sm text-slate-500">신청기간: 2026.07.08 09:00 ~ 2026.07.10 18:00</div></div>
            <Badge tone={roomWindowOpen ? "green" : "amber"}>{roomWindowOpen ? "교육생 신청 가능" : "신청 종료 · 자동배정 가능"}</Badge>
          </div>
        </div>
      </Section>
      <Section title="4인실 자동배정" desc="남녀 분리 후 소속 지역본부, 나이, 직급 순으로 4인실에 배정합니다." action={<button onClick={runAssign} disabled={roomWindowOpen} className={cx("rounded-xl px-4 py-2 text-sm font-bold text-white", roomWindowOpen ? "bg-slate-300" : "bg-[#173F4F]")}>자동배정 실행</button>}>
        {roomWindowOpen && <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">신청기간 진행 중에는 자동배정을 실행할 수 없습니다. 객실 담당자가 기간을 종료해야 합니다.</div>}
        <div className="grid gap-3 lg:grid-cols-3">
          {Object.entries(grouped).map(([room, people]) => <div key={room} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><div className="mb-3 flex items-center justify-between"><div className="font-black">{room}</div><Badge tone={people[0]?.gender === "남" ? "blue" : "purple"}>{people[0]?.gender} · {people.length}/4</Badge></div><div className="space-y-2">{people.map((p) => <div key={p.id} className="rounded-xl bg-slate-50 p-3"><div className="font-bold">{p.name} <span className="text-xs font-normal text-slate-500">{p.rank}</span></div><div className="text-xs text-slate-500">{p.region} · {p.age}세</div>{p.roomRequest && <div className="mt-1 text-xs text-amber-700">요청: {p.roomRequest}</div>}</div>)}</div></div>)}
        </div>
        {confirmed && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">자동배정 결과가 생성되었습니다. 객실 담당자 검토 후 배정확정을 진행하세요.</div>}
      </Section>
    </div>
  );
}

function MealView({ learners, addLog }) {
  const ate = learners.filter((x) => x.meal).length;
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="조식 식수" value="96명" hint="과정별 예상 식수" icon={Utensils} tone="amber" />
        <StatCard label="점심 확인" value={`${ate}/${learners.length}`} hint="QR 또는 수동 확인" icon={QrCode} tone="teal" />
        <StatCard label="식단 공지" value="등록" hint="교육생 포털 표시" icon={FileText} tone="slate" />
        <StatCard label="예외 식단" value="3건" hint="알레르기/채식 등" icon={AlertTriangle} tone="red" />
      </div>
      <Section title="식사 확인" desc="식당 담당자는 태블릿/공용폰으로 교육생 모바일 학생증 QR을 확인합니다." action={<button onClick={() => addLog("Smart Meal", "점심 식사 QR 확인 처리", "2팀 식당 담당자", "amber")} className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white">QR 확인 시뮬레이션</button>}>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {learners.slice(0, 9).map((p) => <div key={p.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div><div className="font-bold">{p.name}</div><div className="text-xs text-slate-500">{p.dept}</div></div>{p.meal ? <Badge tone="green">확인</Badge> : <Badge tone="amber">미확인</Badge>}</div>)}
        </div>
      </Section>
    </div>
  );
}

function FacilityView({ facility, setFacility, addLog }) {
  const [field, setField] = useState("통신");
  const filtered = facility.filter((x) => x.field === field);
  const updateStatus = (id, status) => {
    setFacility((prev) => prev.map((x) => x.id === id ? { ...x, status } : x));
    addLog("Smart Facility", `${field} 신고 ${status} 처리`, `3팀 ${field}`, "purple");
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["전기", "bg-yellow-500"], ["소방", "bg-red-600"], ["안전", "bg-indigo-600"], ["통신", "bg-sky-600"],
        ].map(([x, color]) => <button key={x} onClick={() => setField(x)} className={cx("rounded-2xl p-4 text-left ring-1", field === x ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-800 ring-slate-200")}><div className={cx("mb-2 h-2 w-10 rounded-full", color)} /><div className="font-black">3팀 {x}</div><div className={cx("text-xs", field === x ? "text-slate-300" : "text-slate-500")}>담당 분야만 조회·처리</div></button>)}
      </div>
      <Section title={`${field} 분야 시설 신고`} desc="3팀 담당자는 본인 분야 신고만 조회하고 처리상태를 변경합니다.">
        <div className="space-y-3">
          {filtered.map((item) => <div key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2"><Badge tone="purple">{item.field}</Badge><span className="text-xs text-slate-400">{item.time}</span></div><div className="mt-2 font-black">{item.title}</div><div className="text-sm text-slate-500">{item.place}</div></div><div className="flex gap-2"><Badge tone={item.status === "완료" ? "green" : item.status === "처리중" ? "amber" : "slate"}>{item.status}</Badge><button onClick={() => updateStatus(item.id, "처리중")} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold">처리중</button><button onClick={() => updateStatus(item.id, "완료")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">완료</button></div></div></div>)}
          {filtered.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">현재 {field} 분야 신고가 없습니다.</div>}
        </div>
      </Section>
    </div>
  );
}

function EscortView({ learners, addLog }) {
  const [query, setQuery] = useState("");
  const [scanned, setScanned] = useState(null);
  const list = learners.filter((x) => x.bus !== "자차" && (x.name.includes(query) || x.bus.includes(query) || x.seat.includes(query)));
  const doScan = (p) => {
    setScanned(p);
    addLog("Smart QR", `${p.name} ${p.bus} ${p.seat} 탑승확인`, "버스 인솔자", "green");
  };
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl">
        <div className="flex items-center justify-between"><div><div className="text-xs text-teal-200">현장 담당 차량</div><div className="text-2xl font-black">입소 광주송정역 1호차</div></div><Bus /></div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl bg-white/10 p-3"><div className="text-xl font-black">34</div><div className="text-xs text-slate-300">예약</div></div><div className="rounded-2xl bg-white/10 p-3"><div className="text-xl font-black">24</div><div className="text-xs text-slate-300">탑승</div></div><div className="rounded-2xl bg-white/10 p-3"><div className="text-xl font-black">10</div><div className="text-xs text-slate-300">미탑승</div></div></div>
      </div>
      <Section title="QR 스캔 / 이름 검색" desc="스마트폰 카메라 스캔이 안 될 때는 이름·좌석 검색으로 수동 체크합니다." action={<button onClick={() => doScan(list[0])} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">QR 스캔 시뮬레이션</button>}>
        <div className="relative mb-4"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름, 노선, 좌석 검색" className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-teal-500" /></div>
        {scanned && <div className="mb-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200"><div className="flex items-center gap-2 font-black text-emerald-800"><CheckCircle2 size={18} /> 정상 탑승 대상자입니다</div><div className="mt-1 text-sm text-emerald-700">{scanned.name} · {scanned.bus} · {scanned.seat}</div></div>}
        <div className="space-y-2">{list.slice(0, 8).map((p) => <button key={p.id} onClick={() => doScan(p)} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200"><div><div className="font-bold">{p.name}</div><div className="text-xs text-slate-500">{p.bus} · {p.seat}</div></div>{p.boarded ? <Badge tone="green">탑승</Badge> : <Badge tone="amber">미탑승</Badge>}</button>)}</div>
      </Section>
    </div>
  );
}

function StudentView({ learners, roomWindowOpen, addLog }) {
  const me = learners[0];
  const [roomReq, setRoomReq] = useState("동일객실: 교육생02");
  const [bus, setBus] = useState("광주송정역");
  const submitRoom = () => addLog("Smart Portal", "교육생 객실 요청 제출", me.name, "blue");
  const submitBus = () => addLog("Smart Bus", "교육생 입소 버스 수요 제출", me.name, "blue");
  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <div className="space-y-5">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#173F4F] to-teal-700 p-5 text-white shadow-xl">
          <div className="flex items-center justify-between"><div><div className="text-xs text-teal-100">MOBILE ID</div><div className="text-2xl font-black">모바일 학생증</div></div><QrCode /></div>
          <div className="mt-5 rounded-3xl bg-white p-5 text-center text-slate-900"><div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-2xl bg-slate-900 p-3">{Array.from({ length: 25 }).map((_, i) => <div key={i} className={cx("rounded-sm", [0, 2, 6, 8, 12, 16, 18, 20, 22, 24].includes(i) ? "bg-white" : "bg-slate-900")} />)}</div><div className="mt-4 font-black">{me.name}</div><div className="text-xs text-slate-500">신임자 과정 3기 · 201호</div></div>
          <div className="mt-4 text-xs text-teal-100">버스 탑승, 출석, 식사 확인 시 동일 QR 사용</div>
        </div>
      </div>
      <div className="space-y-5">
        <Section title="교육생 모바일 포털" desc="객실, 버스, 식단, 공지, QR을 모바일에서 확인합니다.">
          <div className="grid gap-3 md:grid-cols-3"><StatCard label="내 객실" value="201호" hint="자동배정 결과" icon={Home} tone="teal" /><StatCard label="입소 버스" value={bus} hint="좌석 12A" icon={Bus} tone="blue" /><StatCard label="오늘 식단" value="등록" hint="2팀 식당 공지" icon={Utensils} tone="amber" /></div>
        </Section>
        <Section title="객실 신청" desc="객실 담당자가 열어둔 신청기간 동안만 요청사항을 제출할 수 있습니다.">
          <div className="mb-3"><Badge tone={roomWindowOpen ? "green" : "amber"}>{roomWindowOpen ? "신청기간 진행중" : "신청기간 종료"}</Badge></div>
          <textarea value={roomReq} onChange={(e) => setRoomReq(e.target.value)} disabled={!roomWindowOpen} className="min-h-24 w-full rounded-2xl border border-slate-200 p-4 outline-none disabled:bg-slate-100" />
          <button onClick={submitRoom} disabled={!roomWindowOpen} className={cx("mt-3 rounded-xl px-4 py-2 text-sm font-bold text-white", roomWindowOpen ? "bg-teal-700" : "bg-slate-300")}>객실 요청 제출</button>
        </Section>
        <Section title="입소 버스 신청" desc="수요조사 기간에 노선 선택 후, 확정 이후 좌석을 예약합니다.">
          <select value={bus} onChange={(e) => setBus(e.target.value)} className="w-full rounded-2xl border border-slate-200 p-3 outline-none"><option>광주송정역</option><option>부산역</option><option>대전역</option><option>서울역</option><option>자차</option></select>
          <button onClick={submitBus} className="mt-3 rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">버스 수요 제출</button>
        </Section>
      </div>
    </div>
  );
}

function PlatformOverview() {
  const modules = [
    ["Smart Access", "권한관리", ShieldCheck, "관리자 중심 역할·화면·데이터 범위 제어"],
    ["Smart Bus", "MVP 1순위", Bus, "입퇴소 수요조사·예약·탑승확인"],
    ["Smart Room", "4인실 자동배정", BedDouble, "신청기간 통제·남녀 분리·자동배정"],
    ["Smart QR", "통합 QR", QrCode, "모바일 학생증 기반 현장 확인"],
  ];
  return (
    <Section title="내부보고 기반 플랫폼 기초모델" desc="앱 개발이 아니라 기존 행정프로그램을 보완하는 현장 운영 자동화 플랫폼입니다.">
      <div className="grid gap-3 md:grid-cols-4">{modules.map(([name, tag, Icon, desc]) => <div key={name} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><Icon className="h-7 w-7 text-[#173F4F]" /><div className="mt-3 flex items-center gap-2"><div className="font-black">{name}</div><Badge tone="slate">{tag}</Badge></div><div className="mt-2 text-xs leading-5 text-slate-500">{desc}</div></div>)}</div>
    </Section>
  );
}

export default function SmartCampusPrototype() {
  const [role, setRole] = useState("admin");
  const [learners] = useState(learnersSeed);
  const [facility, setFacility] = useState(facilitySeed);
  const [busRoutes, setBusRoutes] = useState(busRoutesSeed);
  const [roomWindowOpen, setRoomWindowOpen] = useState(true);
  const [logs, setLogs] = useState([
    { module: "Smart Access", text: "2팀 객실 담당자 신청기간 설정 권한 부여", user: "관리자", time: "09:10", tone: "slate" },
    { module: "Smart Bus", text: "입소 수요조사 자동 집계", user: "1팀 과정 담당자", time: "10:20", tone: "blue" },
    { module: "Smart Room", text: "4인실 자동배정 기준 검토", user: "2팀 객실 담당자", time: "11:05", tone: "teal" },
  ]);
  const addLog = (module, text, user, tone = "slate") => setLogs((prev) => [{ module, text, user, tone, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }, ...prev].slice(0, 6));

  const roleMeta = roles.find((r) => r.id === role);
  const renderView = () => {
    if (role === "admin") return <AdminView role={role} setRole={setRole} logs={logs} />;
    if (role === "team1") return <Team1View busRoutes={busRoutes} setBusRoutes={setBusRoutes} addLog={addLog} />;
    if (role === "room") return <RoomView learners={learners} roomWindowOpen={roomWindowOpen} setRoomWindowOpen={setRoomWindowOpen} addLog={addLog} />;
    if (role === "meal") return <MealView learners={learners} addLog={addLog} />;
    if (role === "facility") return <FacilityView facility={facility} setFacility={setFacility} addLog={addLog} />;
    if (role === "escort") return <EscortView learners={learners} addLog={addLog} />;
    return <StudentView learners={learners} roomWindowOpen={roomWindowOpen} addLog={addLog} />;
  };

  return (
    <div className="min-h-screen bg-[#eef1f0] text-slate-900">
      <Header role={role} setRole={setRole} />
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Prototype v0.3</div>
              <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{roleMeta.name} 화면</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">기관 내부보고에서 정리한 Smart Campus DX 방향을 반영한 플랫폼 프로토타입입니다. 역할에 따라 메뉴·데이터·기능 권한이 달라지고, 데스크톱 업무와 모바일 현장 확인 흐름을 함께 시연합니다.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-bold text-slate-500">핵심 철학</div>
              <div className="mt-1 font-black text-[#173F4F]">반복업무는 시스템이 수행하고, 담당자는 운영과 서비스에 집중</div>
            </div>
          </div>
        </div>
        <RoleSwitcher role={role} setRole={setRole} />
        <PlatformOverview />
        {renderView()}
      </main>
    </div>
  );
}

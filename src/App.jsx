import React, { useMemo, useState } from "react";
import {
  Bell,
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileDown,
  FileText,
  Home,
  LogOut,
  Menu,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Utensils,
  UserCog,
  Users,
  Wrench,
  X,
} from "lucide-react";

const cx = (...v) => v.filter(Boolean).join(" ");

const demoUsers = [
  { id: "admin", name: "관리자", team: "관리", role: "시스템 관리자" },
  { id: "team1", name: "1팀 과정담당", team: "1팀", role: "신임자 과정 3기 담당" },
  { id: "room", name: "2팀 객실담당", team: "2팀", role: "객실 운영 담당" },
  { id: "meal", name: "2팀 식당담당", team: "2팀", role: "식당 운영 담당" },
  { id: "facility", name: "3팀 통신담당", team: "3팀", role: "통신 분야 담당" },
  { id: "escort", name: "버스 인솔자", team: "외부/현장", role: "광주송정역 1호차" },
  { id: "student", name: "교육생", team: "신임자 과정 3기", role: "교육생" },
];

const course = {
  name: "신임자 과정 3기",
  period: "2026.07.13 ~ 2026.07.17",
  students: 96,
  manager: "1팀 과정담당",
};

const students = [
  { id: "S001", name: "교육생01", gender: "남", region: "광주전남", age: 31, rank: "주임", dept: "광주지역본부", bus: "광주송정역", seat: "12A", boarded: true, meal: true, request: "동일객실: 교육생02" },
  { id: "S002", name: "교육생02", gender: "남", region: "광주전남", age: 32, rank: "주임", dept: "광주지역본부", bus: "광주송정역", seat: "12B", boarded: true, meal: true, request: "동일객실: 교육생01" },
  { id: "S003", name: "교육생03", gender: "남", region: "부산경남", age: 42, rank: "대리", dept: "부산울산경남본부", bus: "부산역", seat: "04A", boarded: false, meal: false, request: "" },
  { id: "S004", name: "교육생04", gender: "남", region: "부산경남", age: 45, rank: "과장", dept: "부산울산경남본부", bus: "부산역", seat: "04B", boarded: false, meal: true, request: "" },
  { id: "S005", name: "교육생05", gender: "여", region: "대전충청", age: 29, rank: "주임", dept: "대전세종충청본부", bus: "대전역", seat: "09A", boarded: true, meal: true, request: "저층 희망" },
  { id: "S006", name: "교육생06", gender: "여", region: "대전충청", age: 30, rank: "주임", dept: "대전세종충청본부", bus: "대전역", seat: "09B", boarded: true, meal: false, request: "" },
  { id: "S007", name: "교육생07", gender: "여", region: "서울강원", age: 38, rank: "대리", dept: "서울강원본부", bus: "서울역", seat: "15A", boarded: false, meal: true, request: "건강상 사유" },
  { id: "S008", name: "교육생08", gender: "여", region: "서울강원", age: 40, rank: "과장", dept: "서울강원본부", bus: "서울역", seat: "15B", boarded: false, meal: true, request: "" },
  { id: "S009", name: "교육생09", gender: "남", region: "대전충청", age: 50, rank: "차장", dept: "대전세종충청본부", bus: "자차", seat: "-", boarded: false, meal: false, request: "" },
  { id: "S010", name: "교육생10", gender: "여", region: "부산경남", age: 34, rank: "대리", dept: "부산울산경남본부", bus: "부산역", seat: "05A", boarded: true, meal: true, request: "동일객실: 교육생11" },
  { id: "S011", name: "교육생11", gender: "여", region: "부산경남", age: 35, rank: "대리", dept: "부산울산경남본부", bus: "부산역", seat: "05B", boarded: true, meal: true, request: "동일객실: 교육생10" },
  { id: "S012", name: "교육생12", gender: "남", region: "광주전남", age: 35, rank: "대리", dept: "광주지역본부", bus: "광주송정역", seat: "13A", boarded: false, meal: false, request: "" },
];

const busRows = [
  { id: "A1", type: "입소", route: "광주송정역", time: "09:30", vehicle: "1호차", seats: 45, reserved: 34, boarded: 24 },
  { id: "A2", type: "입소", route: "부산역", time: "08:40", vehicle: "2호차", seats: 45, reserved: 28, boarded: 19 },
  { id: "A3", type: "입소", route: "대전역", time: "09:00", vehicle: "3호차", seats: 45, reserved: 22, boarded: 18 },
  { id: "D1", type: "퇴소", route: "광주송정역", time: "15:30", vehicle: "1호차", seats: 45, reserved: 34, boarded: 0 },
];

const facilityRows = [
  { id: 1, field: "통신", title: "생활관 3층 Wi-Fi 불안정", place: "생활관 312호", status: "접수", time: "09:20" },
  { id: 2, field: "통신", title: "강의동 빔프로젝터 연결 불가", place: "강의실 A-201", status: "처리중", time: "10:05" },
  { id: 3, field: "통신", title: "인터넷 접속 지연", place: "생활관 215호", status: "완료", time: "11:40" },
];

const rankOrder = { 주임: 1, 대리: 2, 과장: 3, 차장: 4 };
function autoAssignRoom(list) {
  const sorted = [...list].sort((a, b) => {
    if (a.gender !== b.gender) return a.gender.localeCompare(b.gender, "ko");
    if (a.region !== b.region) return a.region.localeCompare(b.region, "ko");
    if (a.age !== b.age) return a.age - b.age;
    return (rankOrder[a.rank] || 99) - (rankOrder[b.rank] || 99);
  });
  const count = { 남: 0, 여: 0 };
  return sorted.map((s) => {
    const base = s.gender === "남" ? 201 : 301;
    const room = `${base + Math.floor(count[s.gender]++ / 4)}호`;
    return { ...s, room };
  });
}

function Badge({ children, color = "slate" }) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-sky-100 text-sky-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    purple: "bg-violet-100 text-violet-700",
  };
  return <span className={cx("inline-flex rounded-full px-2 py-1 text-xs font-bold", colors[color])}>{children}</span>;
}

function Card({ children, className }) {
  return <div className={cx("rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200", className)}>{children}</div>;
}

function KPI({ title, value, sub, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-black text-slate-900">{value}</div>
          {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-[#173F4F]"><Icon size={22} /></div>
      </div>
    </Card>
  );
}

function TopBar({ userId, setUserId }) {
  const user = demoUsers.find((u) => u.id === userId);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173F4F] text-white"><Home size={20} /></div>
          <div>
            <div className="font-black text-slate-900">Smart Campus DX</div>
            <div className="text-xs text-slate-500">{course.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative rounded-xl p-2 hover:bg-slate-100"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" /></button>
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none">
            {demoUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ userId, page, setPage }) {
  const common = { admin: [["dashboard", "대시보드", Home], ["access", "권한관리", ShieldCheck]], team1: [["bus", "버스관리", Bus], ["notice", "공지/안내", FileText]], room: [["room", "객실관리", BedDouble]], meal: [["meal", "식당관리", Utensils]], facility: [["facility", "시설처리", Wrench]], escort: [["boarding", "탑승확인", QrCode]], student: [["mobile", "나의 포털", Smartphone]] };
  const menus = common[userId] || [];
  const user = demoUsers.find((u) => u.id === userId);
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="text-sm font-black text-slate-900">{user.name}</div>
        <div className="mt-1 text-xs text-slate-500">{user.role}</div>
      </div>
      <nav className="mt-5 space-y-1">
        {menus.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setPage(id)} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold", page === id ? "bg-[#173F4F] text-white" : "text-slate-600 hover:bg-slate-100")}>
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>
      <button className="absolute bottom-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500"><LogOut size={17} />로그아웃</button>
    </aside>
  );
}

function PageTitle({ title, sub, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-black text-slate-950">{title}</h1>{sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}</div>
      {action}
    </div>
  );
}

function AdminDashboard() {
  return (
    <>
      <PageTitle title="운영 대시보드" sub="오늘 기준 주요 운영 현황" />
      <div className="grid gap-4 md:grid-cols-4">
        <KPI title="운영 과정" value="4개" sub="진행 1 · 예정 3" icon={ClipboardCheck} />
        <KPI title="입소 버스" value="3대" sub="예약 84명" icon={Bus} />
        <KPI title="객실 배정" value="대기" sub="신청기간 진행중" icon={BedDouble} />
        <KPI title="미처리 신고" value="2건" sub="통신 1 · 소방 1" icon={Wrench} />
      </div>
      <Card className="mt-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-black">최근 처리 이력</h2><Badge color="blue">실시간</Badge></div>
        <div className="divide-y divide-slate-100">
          {["2팀 객실담당이 객실 신청기간을 열었습니다.", "1팀 과정담당이 입소 버스 노선을 확정했습니다.", "버스 인솔자가 교육생01 탑승을 확인했습니다."].map((x) => <div key={x} className="flex items-center justify-between py-3"><span className="text-sm text-slate-700">{x}</span><span className="text-xs text-slate-400">방금 전</span></div>)}
        </div>
      </Card>
    </>
  );
}

function AccessPage() {
  const [notice, setNotice] = useState("");
  const rows = [
    ["1팀 과정담당", "버스관리, 공지/안내", "담당 과정", "조회·등록·확정"],
    ["2팀 객실담당", "객실관리", "전체 객실", "신청기간·자동배정·수동조정"],
    ["2팀 식당담당", "식당관리", "식당 운영", "식수수정·식사확인"],
    ["3팀 통신담당", "시설처리", "통신 신고", "처리상태 변경"],
    ["버스 인솔자", "탑승확인", "광주송정역 1호차", "QR·수동체크"],
  ];
  return (
    <>
      <PageTitle title="사용자/권한 관리" sub="담당자별 메뉴, 데이터 범위, 처리권한 설정" action={<button onClick={() => setNotice("신규 사용자 등록 화면이 열렸습니다.")} className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">사용자 추가</button>} />
      {notice && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">{notice}</div>}
      <Card>
        <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">사용자</th><th className="p-3">메뉴</th><th className="p-3">데이터 범위</th><th className="p-3">처리권한</th><th className="p-3" /></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((r) => <tr key={r[0]}><td className="p-3 font-bold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td><td className="p-3">{r[3]}</td><td className="p-3 text-right"><button onClick={() => setNotice(`${r[0]} 권한 수정 패널을 열었습니다.`)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold">수정</button></td></tr>)}</tbody></table>
      </Card>
    </>
  );
}

function BusPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [exported, setExported] = useState(false);
  return (
    <>
      <PageTitle title="버스관리" sub={`${course.name} · ${course.period}`} action={<div className="flex gap-2"><button onClick={() => setExported(true)} className="rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200"><FileDown size={16} className="inline" /> 업체명단</button><button onClick={() => setConfirmed(true)} className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">노선 확정</button></div>} />
      {(confirmed || exported) && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">{confirmed ? "노선이 확정되어 좌석예약이 오픈되었습니다." : ""}{confirmed && exported ? " " : ""}{exported ? "업체 제출용 명단이 생성되었습니다." : ""}</div>}
      <div className="grid gap-4 md:grid-cols-4"><KPI title="신청" value="95명" sub="자차 11명 포함" icon={Users} /><KPI title="차량" value={confirmed ? "4대" : "3대"} sub={confirmed ? "입·퇴소 확정" : "입소 기준"} icon={Bus} /><KPI title="탑승완료" value="61명" sub="실시간 집계" icon={CheckCircle2} /><KPI title="미탑승" value="23명" sub="확인 필요" icon={Search} /></div>
      <Card className="mt-5"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">구분</th><th className="p-3">노선</th><th className="p-3">시간</th><th className="p-3">차량</th><th className="p-3">예약</th><th className="p-3">탑승</th><th className="p-3">상태</th></tr></thead><tbody className="divide-y divide-slate-100">{busRows.map((b) => <tr key={b.id}><td className="p-3 font-bold">{b.type}</td><td className="p-3">{b.route}</td><td className="p-3">{b.time}</td><td className="p-3">{b.vehicle}</td><td className="p-3">{b.reserved}/{b.seats}</td><td className="p-3">{b.boarded}</td><td className="p-3"><Badge color={confirmed ? "green" : "amber"}>{confirmed ? "확정" : "검토중"}</Badge></td></tr>)}</tbody></table></Card>
    </>
  );
}

function RoomPage() {
  const [open, setOpen] = useState(true);
  const [assigned, setAssigned] = useState(false);
  const assignedRows = useMemo(() => autoAssignRoom(students), []);
  const rooms = assignedRows.reduce((a, s) => ((a[s.room] = [...(a[s.room] || []), s]), a), {});
  return (
    <>
      <PageTitle title="객실관리" sub="4인실 기준 객실 신청 및 자동배정" action={<div className="flex gap-2"><button onClick={() => setOpen(true)} className="rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200">신청기간 열기</button><button onClick={() => setOpen(false)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">신청기간 종료</button></div>} />
      <div className="grid gap-4 md:grid-cols-4"><KPI title="신청상태" value={open ? "진행중" : "종료"} sub="객실담당자 권한" icon={CalendarDays} /><KPI title="신청인원" value="96명" sub="전체 교육생" icon={Users} /><KPI title="예외요청" value="5건" sub="동일객실/건강상" icon={FileText} /><KPI title="배정기준" value="4인실" sub="남녀 분리" icon={BedDouble} /></div>
      <Card className="mt-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-black">자동배정</h2><button disabled={open} onClick={() => setAssigned(true)} className={cx("rounded-xl px-4 py-2 text-sm font-bold text-white", open ? "bg-slate-300" : "bg-[#173F4F]")}>자동배정 실행</button></div>
        {open && <div className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-700">신청기간 종료 후 자동배정을 실행할 수 있습니다.</div>}
        <div className="mt-4 grid gap-3 xl:grid-cols-3">{Object.entries(rooms).map(([room, people]) => <div key={room} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="mb-3 flex justify-between"><b>{room}</b><Badge color={people[0].gender === "남" ? "blue" : "purple"}>{people[0].gender} {people.length}/4</Badge></div>{people.map((p) => <div key={p.id} className="mb-2 rounded-xl bg-white p-3 text-sm"><b>{p.name}</b><span className="ml-2 text-xs text-slate-500">{p.region} · {p.age}세 · {p.rank}</span>{p.request && <div className="mt-1 text-xs text-amber-700">{p.request}</div>}</div>)}</div>)}</div>
        {assigned && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">배정 결과가 생성되었습니다. 검토 후 배정확정을 진행하세요.</div>}
      </Card>
    </>
  );
}

function MealPage() {
  const [checked, setChecked] = useState(students.reduce((a, s) => ({ ...a, [s.id]: s.meal }), {}));
  const checkedCount = Object.values(checked).filter(Boolean).length;
  return <><PageTitle title="식당관리" sub="식수 인원 및 식사 확인" action={<button onClick={() => setChecked(students.reduce((a, s) => ({ ...a, [s.id]: true }), {}))} className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">QR 일괄 확인</button>} /><div className="grid gap-4 md:grid-cols-4"><KPI title="조식" value="92명" sub="예정" icon={Utensils} /><KPI title="중식" value="96명" sub="예정" icon={Utensils} /><KPI title="식사확인" value={`${checkedCount}/12`} sub="QR 확인" icon={QrCode} /><KPI title="특이식" value="3건" sub="알레르기 등" icon={FileText} /></div><Card className="mt-5"><table className="w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{students.slice(0, 8).map((s) => <tr key={s.id}><td className="p-3 font-bold">{s.name}</td><td className="p-3">{s.dept}</td><td className="p-3">중식</td><td className="p-3">{checked[s.id] ? <Badge color="green">확인</Badge> : <Badge color="amber">미확인</Badge>}</td><td className="p-3 text-right"><button onClick={() => setChecked({ ...checked, [s.id]: !checked[s.id] })} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold">{checked[s.id] ? "취소" : "확인"}</button></td></tr>)}</tbody></table></Card></>;
}

function FacilityPage() {
  const [rows, setRows] = useState(facilityRows);
  return <><PageTitle title="시설처리" sub="통신 분야 신고만 표시" /><Card>{rows.map((r) => <div key={r.id} className="mb-3 flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><div className="flex gap-2"><Badge color="blue">{r.field}</Badge><span className="text-xs text-slate-400">{r.time}</span></div><div className="mt-2 font-black">{r.title}</div><div className="text-sm text-slate-500">{r.place}</div></div><div className="flex items-center gap-2"><Badge color={r.status === "완료" ? "green" : r.status === "처리중" ? "amber" : "slate"}>{r.status}</Badge><button onClick={() => setRows(rows.map((x) => x.id === r.id ? { ...x, status: "완료" } : x))} className="rounded-xl bg-[#173F4F] px-3 py-2 text-xs font-bold text-white">완료</button></div></div>)}</Card></>;
}

function BoardingPage() {
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState(null);
  const list = students.filter((s) => s.bus !== "자차" && (s.name.includes(q) || s.seat.includes(q) || s.bus.includes(q)));
  return <div className="mx-auto max-w-md"><PageTitle title="탑승확인" sub="광주송정역 1호차" /><Card className="bg-slate-950 text-white"><div className="flex justify-between"><div><div className="text-sm text-slate-300">입소버스</div><div className="text-2xl font-black">광주송정역 1호차</div></div><QrCode /></div><div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-white/10 p-3"><b>34</b><div className="text-xs">예약</div></div><div className="rounded-xl bg-white/10 p-3"><b>24</b><div className="text-xs">탑승</div></div><div className="rounded-xl bg-white/10 p-3"><b>10</b><div className="text-xs">미탑승</div></div></div></Card><Card className="mt-4"><button onClick={() => setChecked(list[0])} className="mb-3 w-full rounded-xl bg-[#173F4F] py-3 font-bold text-white">QR 스캔</button><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름/좌석 검색" className="mb-3 w-full rounded-xl border border-slate-200 p-3" />{checked && <div className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{checked.name} 정상 탑승 처리</div>}{list.slice(0, 6).map((s) => <button key={s.id} onClick={() => setChecked(s)} className="mb-2 flex w-full justify-between rounded-xl bg-slate-50 p-3 text-left"><span><b>{s.name}</b><div className="text-xs text-slate-500">{s.bus} · {s.seat}</div></span>{s.boarded ? <Badge color="green">탑승</Badge> : <Badge color="amber">미탑승</Badge>}</button>)}</Card></div>;
}

function StudentMobile() {
  const [tab, setTab] = useState("home");
  const [submitted, setSubmitted] = useState(false);
  const [roomText, setRoomText] = useState("동일객실: 교육생02");
  return <div className="mx-auto max-w-md"><div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"><div className="bg-[#173F4F] p-5 text-white"><div className="text-sm text-teal-100">신임자 과정 3기</div><div className="mt-1 text-2xl font-black">교육생01</div></div><div className="p-5">{tab === "home" && <div className="grid gap-3"><KPI title="내 객실" value={submitted ? "신청완료" : "201호"} sub={submitted ? "객실담당자 검토 대기" : "배정 완료"} icon={BedDouble} /><KPI title="입소 버스" value="광주송정역" sub="1호차 12A" icon={Bus} /><KPI title="오늘 식단" value="등록" sub="중식 12:00" icon={Utensils} /></div>}{tab === "qr" && <div className="text-center"><div className="mx-auto grid h-44 w-44 grid-cols-5 gap-1 rounded-2xl bg-slate-900 p-3">{Array.from({ length: 25 }).map((_, i) => <div key={i} className={cx("rounded-sm", [0, 2, 6, 8, 12, 16, 18, 20, 22, 24].includes(i) ? "bg-white" : "bg-slate-900")} />)}</div><div className="mt-4 font-black">모바일 학생증 QR</div><div className="text-sm text-slate-500">버스·출석·식사 확인 공통 사용</div></div>}{tab === "room" && <div><h2 className="font-black">객실 요청</h2>{submitted && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">객실 요청이 제출되었습니다.</div>}<textarea value={roomText} onChange={(e) => setRoomText(e.target.value)} className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 p-3" /><button onClick={() => setSubmitted(true)} className="mt-3 w-full rounded-xl bg-[#173F4F] py-3 font-bold text-white">제출</button></div>}</div><div className="grid grid-cols-3 border-t border-slate-100">{[["home", "홈"], ["room", "객실"], ["qr", "QR"]].map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={cx("py-4 text-sm font-bold", tab === id ? "text-[#173F4F]" : "text-slate-400")}>{label}</button>)}</div></div></div>;
}

function AppContent({ userId, page, setPage }) {
  if (userId === "admin") return page === "access" ? <AccessPage /> : <AdminDashboard />;
  if (userId === "team1") return <BusPage />;
  if (userId === "room") return <RoomPage />;
  if (userId === "meal") return <MealPage />;
  if (userId === "facility") return <FacilityPage />;
  if (userId === "escort") return <BoardingPage />;
  return <StudentMobile />;
}

export default function SmartCampusPrototype() {
  const [userId, setUserId] = useState("admin");
  const defaultPage = { admin: "dashboard", team1: "bus", room: "room", meal: "meal", facility: "facility", escort: "boarding", student: "mobile" };
  const [page, setPage] = useState(defaultPage[userId]);
  function changeUser(id) { setUserId(id); setPage(defaultPage[id]); }
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <TopBar userId={userId} setUserId={changeUser} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar userId={userId} page={page} setPage={setPage} />
        <main className="flex-1 p-4 lg:p-6"><AppContent userId={userId} page={page} setPage={setPage} /></main>
      </div>
    </div>
  );
}

import React, { useMemo, useRef, useState } from "react";
import {
  Bell,
  BedDouble,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Copy,
  Download,
  FileDown,
  FileText,
  Home,
  LogOut,
  Menu,
  QrCode,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Upload,
  Users,
  Utensils,
  Wrench,
  X,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const cx = (...v) => v.filter(Boolean).join(" ");

const demoUsers = [
  { id: "admin", empId: "10001", name: "관리자", role: "시스템 관리자" },
  { id: "course", empId: "10002", name: "과정담당자", role: "신임자 과정 3기 운영" },
  { id: "room", empId: "10003", name: "객실담당자", role: "객실 운영" },
  { id: "meal", empId: "10004", name: "식당담당자", role: "식당 운영" },
  { id: "facility", empId: "10005", name: "시설담당자", role: "시설 처리" },
  { id: "escort", empId: "10006", name: "버스 인솔자", role: "광주송정역 1호차" },
  { id: "student", empId: "10007", name: "교육생", role: "교육생 포털" },
];

const course = {
  name: "신임자 과정 3기",
  period: "2026.07.13 ~ 2026.07.17",
  classroom: "교육동 2층 A-201 강의실",
  instructor: "김OO 강사",
  students: 96,
};

const initialScheduleRows = [
  { id: 1, time: "09:00~10:00", title: "입교식 및 과정 안내", room: "대강당", day: "월" },
  { id: 2, time: "10:10~12:00", title: "공단 이해 및 직무 기본", room: "A-201", day: "월" },
  { id: 3, time: "13:00~15:00", title: "민원응대 실습", room: "A-201", day: "월" },
  { id: 4, time: "15:10~17:00", title: "정보보안 및 개인정보보호", room: "전산실습실", day: "월" },
];

const uploadedScheduleRows = [
  { id: 5, time: "09:00~10:30", title: "입교식 및 안전교육", room: "대강당", day: "월" },
  { id: 6, time: "10:40~12:00", title: "공단 이해 및 직무 기본", room: "A-201", day: "월" },
  { id: 7, time: "13:00~15:00", title: "현장 민원응대 실습", room: "A-203", day: "월" },
  { id: 8, time: "15:10~17:00", title: "정보보안 및 개인정보보호", room: "전산실습실", day: "월" },
  { id: 9, time: "09:00~12:00", title: "업무시스템 실습", room: "전산실습실", day: "화" },
];

const initialMealMenu = {
  breakfast: "쌀밥, 북엇국, 계란찜, 김치, 과일",
  lunch: "현미밥, 제육볶음, 된장국, 상추겉절이, 깍두기",
  dinner: "카레라이스, 유부장국, 돈가스, 샐러드, 배추김치",
  updatedAt: "기본 식단",
};

const uploadedMealMenu = {
  breakfast: "잡곡밥, 소고기무국, 두부조림, 김구이, 배추김치",
  lunch: "보리밥, 닭갈비, 미역국, 오이무침, 깍두기",
  dinner: "토마토스파게티, 크림스프, 함박스테이크, 그린샐러드, 피클",
  updatedAt: "식단표_2026_신임자3기.xlsx 업로드 완료",
};

const noticesSeed = [
  { id: 0, title: "[긴급] 우천으로 입소버스 출발 15분 지연", body: "광주송정역 1호차는 우천으로 인해 15분 지연 출발합니다. 현장 안내를 확인해 주세요.", time: "07:55", unread: true, urgent: true },
  { id: 1, title: "입소버스 수요조사가 열렸습니다.", body: "교육생 포털에서 입소/퇴소 버스 이용 여부를 선택해 주세요.", time: "09:10", unread: true, urgent: false },
  { id: 2, title: "객실 신청기간 안내", body: "동일객실 및 건강상 요청사항은 신청기간 내 제출 가능합니다.", time: "10:20", unread: true, urgent: false },
  { id: 3, title: "강의실 변경 없음", body: "오늘 강의는 교육동 2층 A-201에서 진행됩니다.", time: "08:40", unread: false, urgent: false },
];

const students = [
  { id: "S001", name: "교육생01", gender: "남", region: "광주전남", age: 31, rank: "주임", dept: "광주지역본부", bus: "광주송정역", day: "월요일", phone: "010-****-1201", seat: "12A", boarded: true, meal: true, request: "동일객실: 교육생02" },
  { id: "S002", name: "교육생02", gender: "남", region: "광주전남", age: 32, rank: "주임", dept: "광주지역본부", bus: "광주송정역", day: "월요일", phone: "010-****-1202", seat: "12B", boarded: true, meal: true, request: "동일객실: 교육생01" },
  { id: "S003", name: "교육생03", gender: "남", region: "부산경남", age: 42, rank: "대리", dept: "부산울산경남본부", bus: "부산역", day: "월요일", phone: "010-****-1203", seat: "04A", boarded: false, meal: false, request: "" },
  { id: "S004", name: "교육생04", gender: "남", region: "부산경남", age: 45, rank: "과장", dept: "부산울산경남본부", bus: "부산역", day: "월요일", phone: "010-****-1204", seat: "04B", boarded: false, meal: true, request: "" },
  { id: "S005", name: "교육생05", gender: "여", region: "대전충청", age: 29, rank: "주임", dept: "대전세종충청본부", bus: "대전역", day: "월요일", phone: "010-****-1205", seat: "09A", boarded: true, meal: true, request: "저층 희망" },
  { id: "S006", name: "교육생06", gender: "여", region: "대전충청", age: 30, rank: "주임", dept: "대전세종충청본부", bus: "대전역", day: "월요일", phone: "010-****-1206", seat: "09B", boarded: true, meal: false, request: "" },
  { id: "S007", name: "교육생07", gender: "여", region: "서울강원", age: 38, rank: "대리", dept: "서울강원본부", bus: "서울역", day: "월요일", phone: "010-****-1207", seat: "15A", boarded: false, meal: true, request: "건강상 사유" },
  { id: "S008", name: "교육생08", gender: "여", region: "서울강원", age: 40, rank: "과장", dept: "서울강원본부", bus: "서울역", day: "월요일", phone: "010-****-1208", seat: "15B", boarded: false, meal: true, request: "" },
  { id: "S009", name: "교육생09", gender: "남", region: "대전충청", age: 50, rank: "차장", dept: "대전세종충청본부", bus: "자차", day: "월요일", phone: "010-****-1209", seat: "-", boarded: false, meal: false, request: "" },
  { id: "S010", name: "교육생10", gender: "여", region: "부산경남", age: 34, rank: "대리", dept: "부산울산경남본부", bus: "부산역", day: "월요일", phone: "010-****-1210", seat: "05A", boarded: true, meal: true, request: "동일객실: 교육생11" },
  { id: "S011", name: "교육생11", gender: "여", region: "부산경남", age: 35, rank: "대리", dept: "부산울산경남본부", bus: "부산역", day: "월요일", phone: "010-****-1211", seat: "05B", boarded: true, meal: true, request: "동일객실: 교육생10" },
  { id: "S012", name: "교육생12", gender: "남", region: "광주전남", age: 35, rank: "대리", dept: "광주지역본부", bus: "광주송정역", day: "월요일", phone: "010-****-1212", seat: "13A", boarded: false, meal: false, request: "" },
];

const initialBusRows = [
  { id: "A1", type: "입소", route: "광주송정역", day: "월요일", time: "확정 전", vehicle: "1호차", seats: 45, reserved: 34, boarded: 24, status: "검토중" },
  { id: "A2", type: "입소", route: "부산역", day: "월요일", time: "확정 전", vehicle: "2호차", seats: 45, reserved: 28, boarded: 19, status: "검토중" },
  { id: "A3", type: "입소", route: "대전역", day: "월요일", time: "확정 전", vehicle: "3호차", seats: 45, reserved: 22, boarded: 18, status: "검토중" },
  { id: "D1", type: "퇴소", route: "광주송정역", day: "금요일", time: "확정 전", vehicle: "1호차", seats: 45, reserved: 34, boarded: 0, status: "검토중" },
];

const confirmTimes = { A1: "09:30", A2: "08:40", A3: "09:00", D1: "15:30" };

const initialFacilityRows = [
  { id: 1, field: "통신", title: "생활관 3층 Wi-Fi 불안정", place: "생활관 312호", status: "접수", time: "09:20" },
  { id: 2, field: "통신", title: "강의동 빔프로젝터 연결 불가", place: "강의실 A-201", status: "처리중", time: "10:05" },
  { id: 3, field: "통신", title: "인터넷 접속 지연", place: "생활관 215호", status: "완료", time: "11:40" },
  { id: 4, field: "설비", title: "생활관 2층 급수 누수", place: "생활관 214호", status: "접수", time: "09:45" },
  { id: 5, field: "설비", title: "강의동 화장실 변기 막힘", place: "강의동 1층 화장실", status: "처리중", time: "10:30" },
  { id: 6, field: "기계", title: "강의동 냉방기 작동 불량", place: "강의실 A-203", status: "접수", time: "09:10" },
  { id: 7, field: "기계", title: "생활관 엘리베이터 소음", place: "생활관 로비", status: "완료", time: "08:50" },
  { id: 8, field: "소방", title: "강의동 소화기 압력 미달", place: "강의동 2층 복도", status: "접수", time: "09:30" },
  { id: 9, field: "소방", title: "생활관 비상구 표시등 고장", place: "생활관 3층 비상계단", status: "처리중", time: "10:15" },
];

const ALL_FACILITY_FIELDS = ["통신", "설비", "기계", "소방"];

const SCREEN_DEFS = {
  "대시보드": ["dashboard", Home],
  "권한관리": ["access", ShieldCheck],
  "버스관리": ["bus", Bus],
  "공지/안내": ["notice", FileText],
  "운영준비": ["prep", Settings2],
  "객실관리": ["room", BedDouble],
  "식당관리": ["meal", Utensils],
  "시설처리": ["facility", Wrench],
  "탑승확인": ["boarding", QrCode],
  "나의 포털": ["mobile", Smartphone],
};

const ALL_SCREENS = Object.keys(SCREEN_DEFS);

const PAGE_TO_SCREEN = Object.fromEntries(Object.entries(SCREEN_DEFS).map(([screen, [pageId]]) => [pageId, screen]));

function getAllowedScreens(userId, accessRows) {
  if (userId === "admin") return ["대시보드", "권한관리"];
  if (userId === "student") return ["나의 포털"];
  return accessRows.find((r) => r.userKey === userId)?.screens || [];
}

function firstPageFor(userId, accessRows) {
  const screens = getAllowedScreens(userId, accessRows);
  const first = screens[0];
  return first ? SCREEN_DEFS[first][0] : null;
}

const initialAccessRows = [
  { id: 1, user: "과정담당자", userKey: "course", screens: ["버스관리", "공지/안내", "운영준비"], perms: "노선확정·공지작성·시간표업로드·시간표합반" },
  { id: 2, user: "객실담당자", userKey: "room", screens: ["객실관리"], perms: "신청기간·자동배정·수동조정" },
  { id: 3, user: "식당담당자", userKey: "meal", screens: ["식당관리"], perms: "식단표업로드·식수확인" },
  { id: 4, user: "시설담당자", userKey: "facility", screens: ["시설처리"], facilityFields: ["통신"], perms: "접수·처리중·완료 변경" },
  { id: 5, user: "버스 인솔자", userKey: "escort", screens: ["탑승확인"], perms: "QR·수동체크" },
];

const weeklyFacilityTrend = [
  { day: "월", count: 5 }, { day: "화", count: 8 }, { day: "수", count: 6 },
  { day: "목", count: 9 }, { day: "금", count: 4 }, { day: "토", count: 2 }, { day: "일", count: 1 },
];

const kpiCompareData = [
  { name: "전화·방문\n문의", before: 100, after: 55 },
  { name: "처리\n평균시간", before: 100, after: 70 },
  { name: "재문의율", before: 100, after: 48 },
  { name: "보고서\n작성시간", before: 100, after: 30 },
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
  return <span className={cx("inline-flex shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold", colors[color])}>{children}</span>;
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

function ProgressRow({ label, value, color = "bg-[#173F4F]" }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold text-slate-500"><span>{label}</span><span>{value}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className={cx("h-2 rounded-full", color)} style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  );
}

function TopBar({ userId, unread, onBell, onMenuClick, onLogout }) {
  const user = demoUsers.find((u) => u.id === userId);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173F4F] text-white"><Home size={20} /></div>
          <div>
            <div className="font-black text-slate-900">Smart Campus DX</div>
            <div className="text-xs text-slate-500">{course.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBell} className="relative rounded-xl p-2 hover:bg-slate-100">
            <Bell size={19} />
            {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">{unread}</span>}
          </button>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-bold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </div>
          <button onClick={onLogout} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="로그아웃"><LogOut size={19} /></button>
        </div>
      </div>
    </header>
  );
}

function LoginScreen({ credentials, onAuthenticated }) {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const user = demoUsers.find((u) => u.empId === empId.trim());
    const cred = user && credentials[user.empId];
    if (!user || !cred || cred.password !== password) {
      setError("사번 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    setError("");
    onAuthenticated(user, !cred.changed);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173F4F] text-white"><Home size={20} /></div>
          <div className="font-black text-slate-900">Smart Campus DX</div>
        </div>
        <p className="mb-4 text-sm text-slate-500">사번과 비밀번호를 입력해 로그인하세요. 최초 로그인 시 비밀번호는 사번과 동일하며, 로그인 후 새 비밀번호를 설정합니다.</p>
        <form onSubmit={submit} className="space-y-2">
          <input
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            placeholder="사번"
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#173F4F]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#173F4F]"
          />
          {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">{error}</div>}
          <button type="submit" className="w-full rounded-xl bg-[#173F4F] py-2.5 text-sm font-bold text-white">로그인</button>
        </form>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <div className="mb-1.5 font-bold text-slate-600">데모 계정 안내 (최초 비밀번호 = 사번)</div>
          <div className="flex flex-wrap gap-1.5">
            {demoUsers.map((u) => <span key={u.id} className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">{u.empId} · {u.name}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordSetupScreen({ user, onSubmit }) {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!pw1.trim()) { setError("새 비밀번호를 입력하세요."); return; }
    if (pw1 === user.empId) { setError("사번과 다른 비밀번호를 설정하세요."); return; }
    if (pw1 !== pw2) { setError("새 비밀번호가 일치하지 않습니다."); return; }
    setError("");
    onSubmit(pw1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173F4F] text-white"><ShieldCheck size={20} /></div>
          <div className="font-black text-slate-900">최초 로그인 · 비밀번호 설정</div>
        </div>
        <p className="mb-4 text-sm text-slate-500">{user.name}({user.empId}) 님, 보안을 위해 초기 비밀번호(사번)를 새 비밀번호로 변경해 주세요.</p>
        <form onSubmit={submit} className="space-y-2">
          <input
            type="password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            placeholder="새 비밀번호"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#173F4F]"
          />
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="새 비밀번호 확인"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#173F4F]"
          />
          {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">{error}</div>}
          <button type="submit" className="w-full rounded-xl bg-[#173F4F] py-2.5 text-sm font-bold text-white">비밀번호 설정하고 시작하기</button>
        </form>
      </div>
    </div>
  );
}

function NoAccessPage({ screen, message }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400"><ShieldCheck size={28} /></div>
      <div className="mt-3 font-black text-slate-900">{message || `${screen} 화면 접근 권한이 없습니다`}</div>
      <div className="mt-1 text-sm text-slate-500">관리자에게 사용자/권한 관리에서 권한 부여를 요청하세요.</div>
    </div>
  );
}

function Sidebar({ userId, allowedScreens, page, setPage, mobileOpen, onClose, onLogout }) {
  const menus = allowedScreens.map((screen) => {
    const [id, Icon] = SCREEN_DEFS[screen];
    return [id, screen, Icon];
  });
  const user = demoUsers.find((u) => u.id === userId);
  const navContent = (
    <>
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="text-sm font-black text-slate-900">{user.name}</div>
        <div className="mt-1 text-xs text-slate-500">{user.role}</div>
      </div>
      <nav className="mt-5 space-y-1">
        {menus.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => { setPage(id); onClose && onClose(); }}
            className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold", page === id ? "bg-[#173F4F] text-white" : "text-slate-600 hover:bg-slate-100")}
          >
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="absolute bottom-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"><LogOut size={17} />로그아웃</button>
    </>
  );
  return (
    <>
      <aside className="relative hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">{navContent}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80vw] overflow-y-auto bg-white p-4 shadow-xl">{navContent}</aside>
        </div>
      )}
    </>
  );
}

function PageTitle({ title, sub, action }) {
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-black text-slate-950">{title}</h1>{sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}</div>{action}</div>;
}

function NotificationPanel({ open, notices, onClose, onReadAll }) {
  if (!open) return null;
  return (
    <div className="fixed right-4 top-20 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between"><b>알림</b><button onClick={onClose} className="text-sm text-slate-400">닫기</button></div>
      <div className="space-y-2">{notices.map((n) => <div key={n.id} className={cx("rounded-xl p-3 ring-1", n.urgent ? "bg-rose-50 ring-rose-200" : n.unread ? "bg-sky-50 ring-transparent" : "bg-slate-50 ring-transparent")}><div className="flex justify-between gap-2"><span className="flex items-center gap-1.5"><b className="text-sm">{n.title}</b>{n.urgent && <Badge color="red">긴급</Badge>}</span><span className="text-xs text-slate-400">{n.time}</span></div><p className="mt-1 text-xs leading-5 text-slate-600">{n.body}</p></div>)}</div>
      <button onClick={onReadAll} className="mt-3 w-full rounded-xl bg-[#173F4F] py-2 text-sm font-bold text-white">모두 읽음 처리</button>
    </div>
  );
}

function AdminStatusTab({ busRows, roomOpen, notices, scheduleRows, mealMenu, facilityRows, busRate, boardRate, facilityDone, facilityRate, totalReserved, totalBoarded }) {
  const reportRows = [
    ["버스 수요조사", `${totalReserved}/${course.students}명`, `${busRate}%`, busRate >= 90 ? "정상" : "확인필요"],
    ["버스 탑승확인", `${totalBoarded}/${totalReserved}명`, `${boardRate}%`, boardRate >= 80 ? "정상" : "확인필요"],
    ["객실 신청/배정", roomOpen ? "신청 접수중" : "배정 가능", roomOpen ? "70%" : "100%", roomOpen ? "진행중" : "정상"],
    ["시간표 반영", `${scheduleRows.length}개 교시`, "100%", "정상"],
    ["식단표 반영", mealMenu.updatedAt.includes("업로드") ? "업로드 완료" : "기본 식단", mealMenu.updatedAt.includes("업로드") ? "100%" : "60%", "진행중"],
    ["시설 민원처리", `${facilityDone}/${facilityRows.length}건`, `${facilityRate}%`, facilityRate === 100 ? "정상" : "처리중"],
  ];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <KPI title="운영 과정" value="4개" sub="진행 1 · 예정 3" icon={ClipboardCheck} />
        <KPI title="수요조사율" value={`${busRate}%`} sub={`${totalReserved}/${course.students}명`} icon={Bus} />
        <KPI title="객실 배정" value={roomOpen ? "접수중" : "배정가능"} sub="4인실 자동배정" icon={BedDouble} />
        <KPI title="시설 처리율" value={`${facilityRate}%`} sub={`${facilityDone}/${facilityRows.length}건 완료`} icon={Wrench} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-black">보고 지표 요약</h2><Badge color="blue">보고용</Badge></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">구분</th><th className="p-3">현황</th><th className="p-3">진행률</th><th className="p-3">상태</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{reportRows.map((r) => <tr key={r[0]}><td className="p-3 font-bold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td><td className="p-3"><Badge color={r[3] === "정상" ? "green" : r[3] === "확인필요" ? "red" : "amber"}>{r[3]}</Badge></td></tr>)}</tbody>
          </table></div>
        </Card>
        <Card>
          <h2 className="mb-3 font-black">KPI 추이</h2>
          <div className="space-y-4">
            <ProgressRow label="버스 신청률" value={busRate} />
            <ProgressRow label="탑승 확인률" value={boardRate} color="bg-emerald-500" />
            <ProgressRow label="공지 확인률" value={Math.max(0, 100 - notices.filter((n) => n.unread).length * 12)} color="bg-sky-500" />
            <ProgressRow label="시설 처리율" value={facilityRate} color="bg-amber-500" />
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card>
          <h2 className="mb-3 font-black">오늘 일정</h2>
          {scheduleRows.slice(0, 4).map((s) => <div key={`${s.day}-${s.time}-${s.title}`} className="mb-3 rounded-xl bg-slate-50 p-3"><b className="text-sm">{s.title}</b><div className="text-xs text-slate-500">{s.day} · {s.time} · {s.room}</div></div>)}
        </Card>
        <Card>
          <h2 className="mb-3 font-black">반영 상태</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>시간표</span><Badge color="green">{scheduleRows.length}개 반영</Badge></div>
            <div className="flex justify-between"><span>식단표</span><Badge color={mealMenu.updatedAt.includes("업로드") ? "green" : "amber"}>{mealMenu.updatedAt}</Badge></div>
            <div className="flex justify-between"><span>알림 미확인</span><Badge color="blue">{notices.filter((n) => n.unread).length}건</Badge></div>
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-black">최근 처리 이력</h2>
          {["과정담당자가 시간표를 업로드했습니다.", "식당담당자가 식단표를 업로드했습니다.", "버스 업체 제출용 명단이 생성되었습니다.", "시설담당자가 상태를 처리중으로 변경했습니다."].map((x) => <div key={x} className="flex items-center justify-between border-b border-slate-100 py-2"><span className="text-sm">{x}</span><span className="text-xs text-slate-400">방금 전</span></div>)}
        </Card>
      </div>
    </>
  );
}

function AdminStatsTab() {
  return (
    <Card>
      <h2 className="mb-3 font-black">주간 시설 신고·처리 추이</h2>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyFacilityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#173F4F" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function AdminKpiTab({ facilityDone, facilityRows, facilityRate, boardRate, totalBoarded, totalReserved }) {
  const kpis = [
    {
      label: "당일 시설 처리 완료율",
      value: `${facilityRate}%`,
      target: "목표 90% 이상",
      ok: facilityRate >= 90,
      formula: "완료 건수 ÷ 접수 건수",
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
      label: "버스 탑승 확인률",
      value: `${boardRate}%`,
      target: `${totalBoarded}/${totalReserved}명 기준`,
      ok: boardRate >= 80,
      formula: "탑승 확인 인원 ÷ 예약 인원",
    },
  ];
  return (
    <>
      <Card>
        <h2 className="mb-3 font-black">핵심 운영 지표 (KPI)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">{k.label}</div>
                {k.ok
                  ? <Badge color="green">목표 충족</Badge>
                  : <Badge color="amber">관찰 필요</Badge>}
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-800">{k.value}</div>
              <div className="mt-1 text-xs text-slate-500">{k.target}</div>
              <div className="mt-2 border-t border-slate-200 pt-2 text-[11px] text-slate-400">{k.formula}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-5">
        <h2 className="mb-3 font-black">현행(100) 대비 목표 — 종합 비교</h2>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiCompareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} allowDataOverflow />
              <Tooltip />
              <Bar dataKey="before" name="현행" fill="#cbd5e1" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="after" name="목표" fill="#173F4F" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-slate-400">※ 평균 처리시간·재문의율은 시범운영 데이터 확보 후 실측값으로 교체 필요</div>
      </Card>
    </>
  );
}

function AdminReportTab({ facilityRows, facilityDone, busRate, boardRate, totalReserved, totalBoarded, notices }) {
  const unreadCount = notices.filter((n) => n.unread).length;
  const urgentUnread = notices.filter((n) => n.unread && n.urgent).length;
  const inProgress = facilityRows.length - facilityDone;
  return (
    <Card>
      <h2 className="mb-3 font-black">자동 생성 보고서 미리보기</h2>
      <div className="rounded-xl bg-slate-50 p-5 font-mono text-sm leading-relaxed text-slate-600 ring-1 ring-slate-100">
        <div className="mb-2 font-bold text-slate-800">{course.name} · 일일 운영 보고</div>
        · 시설 신고 {facilityRows.length}건 / 완료 {facilityDone}건 / 처리중 {inProgress}건<br />
        · 버스 수요조사 {totalReserved}/{course.students}명 ({busRate}%)<br />
        · 버스 탑승 확인 {totalBoarded}/{totalReserved}명 ({boardRate}%)<br />
        · 공지 미확인 {unreadCount}건 (긴급 {urgentUnread}건)<br />
        · 전 항목은 담당자 처리 내역에서 자동 집계됨 (수기 작성 불필요)
      </div>
      <div className="mt-2 text-xs text-slate-400">※ 실제 운영 시 일/주/월 단위로 자동 발행되며 PDF·Excel로 추출됩니다.</div>
    </Card>
  );
}

function AdminDashboard({ busRows, roomOpen, notices, scheduleRows, mealMenu, facilityRows }) {
  const [tab, setTab] = useState("status");
  const totalReserved = busRows.reduce((a, b) => a + b.reserved, 0);
  const totalBoarded = busRows.reduce((a, b) => a + b.boarded, 0);
  const busRate = Math.round((totalReserved / course.students) * 100);
  const boardRate = Math.round((totalBoarded / totalReserved) * 100);
  const facilityDone = facilityRows.filter((r) => r.status === "완료").length;
  const facilityRate = Math.round((facilityDone / facilityRows.length) * 100);
  const shared = { busRows, roomOpen, notices, scheduleRows, mealMenu, facilityRows, busRate, boardRate, facilityDone, facilityRate, totalReserved, totalBoarded };

  return (
    <>
      <PageTitle title="운영 대시보드" sub="내부보고용 KPI 및 업무 진행현황" />
      <div className="mb-5 flex w-fit rounded-full bg-slate-100 p-0.5">
        {[["status", "운영현황"], ["stats", "통계"], ["kpi", "KPI"], ["report", "보고서"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={cx("rounded-full px-4 py-1.5 text-xs font-bold", tab === key ? "bg-[#173F4F] text-white" : "text-slate-500")}>
            {label}
          </button>
        ))}
      </div>
      {tab === "status" && <AdminStatusTab {...shared} />}
      {tab === "stats" && <AdminStatsTab />}
      {tab === "kpi" && <AdminKpiTab {...shared} />}
      {tab === "report" && <AdminReportTab {...shared} />}
    </>
  );
}

function AccessPage({ accessRows, setAccessRows }) {
  const rows = accessRows;
  const setRows = setAccessRows;
  const [notice, setNotice] = useState("");
  const [editId, setEditId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const emptyForm = { user: "", screens: [], perms: "", userKey: undefined, facilityFields: [] };
  const [form, setForm] = useState(emptyForm);

  const toggleScreen = (screen) => {
    setForm((s) => ({ ...s, screens: s.screens.includes(screen) ? s.screens.filter((x) => x !== screen) : [...s.screens, screen] }));
  };

  const toggleFacilityField = (field) => {
    setForm((s) => ({ ...s, facilityFields: s.facilityFields.includes(field) ? s.facilityFields.filter((x) => x !== field) : [...s.facilityFields, field] }));
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setForm({ user: r.user, screens: r.screens, perms: r.perms, userKey: r.userKey, facilityFields: r.facilityFields || [] });
    setAddOpen(false);
    setNotice("");
  };

  const saveEdit = () => {
    if (!form.user.trim()) return;
    setRows(rows.map((r) => (r.id === editId ? { ...r, ...form } : r)));
    setNotice(`${form.user} 권한이 수정되었습니다.`);
    setEditId(null);
    setForm(emptyForm);
  };

  const addUser = () => {
    if (!form.user.trim()) return;
    setRows([...rows, { id: Date.now(), ...form }]);
    setNotice(`${form.user} 사용자가 추가되었습니다.`);
    setForm(emptyForm);
    setAddOpen(false);
  };

  const formOpen = addOpen || editId !== null;

  return (
    <>
      <PageTitle
        title="사용자/권한 관리"
        sub="담당자별 화면 접근 권한, 처리권한 설정"
        action={
          <button
            onClick={() => { setAddOpen((v) => !v); setEditId(null); setForm(emptyForm); setNotice(""); }}
            className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white"
          >
            사용자 추가
          </button>
        }
      />
      {notice && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">{notice}</div>}
      {formOpen && (
        <Card className="mb-4">
          <h2 className="mb-3 font-black">{editId !== null ? "권한 수정" : "신규 사용자 추가"}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <input value={form.user} onChange={(e) => setForm((s) => ({ ...s, user: e.target.value }))} placeholder="사용자 (예: 홍보담당자)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173F4F] sm:col-span-2" />
            <input value={form.perms} onChange={(e) => setForm((s) => ({ ...s, perms: e.target.value }))} placeholder="처리권한" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173F4F] sm:col-span-2" />
          </div>
          <div className="mt-3">
            <div className="mb-1.5 text-xs font-bold text-slate-500">담당 화면 (데이터 범위)</div>
            <div className="flex flex-wrap gap-2">
              {ALL_SCREENS.map((screen) => (
                <button
                  key={screen}
                  type="button"
                  onClick={() => toggleScreen(screen)}
                  className={cx(
                    "rounded-full px-3 py-1.5 text-xs font-bold ring-1",
                    form.screens.includes(screen) ? "bg-[#173F4F] text-white ring-[#173F4F]" : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
                  )}
                >
                  {screen}
                </button>
              ))}
            </div>
          </div>
          {form.screens.includes("시설처리") && (
            <div className="mt-3">
              <div className="mb-1.5 text-xs font-bold text-slate-500">담당 분야 (시설처리 화면 내 범위)</div>
              <div className="flex flex-wrap gap-2">
                {ALL_FACILITY_FIELDS.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleFacilityField(field)}
                    className={cx(
                      "rounded-full px-3 py-1.5 text-xs font-bold ring-1",
                      form.facilityFields.includes(field) ? "bg-amber-500 text-white ring-amber-500" : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            {editId !== null ? (
              <>
                <button onClick={saveEdit} className="rounded-lg bg-[#173F4F] px-4 py-1.5 text-xs font-bold text-white">저장</button>
                <button onClick={() => { setEditId(null); setForm(emptyForm); }} className="text-xs text-slate-400 underline">취소</button>
              </>
            ) : (
              <>
                <button onClick={addUser} className="rounded-lg bg-[#173F4F] px-4 py-1.5 text-xs font-bold text-white">추가</button>
                <button onClick={() => setAddOpen(false)} className="text-xs text-slate-400 underline">취소</button>
              </>
            )}
          </div>
        </Card>
      )}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="p-3">사용자</th><th className="p-3">담당 화면</th><th className="p-3">처리권한</th><th className="p-3" /></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className={cx(editId === r.id && "bg-slate-50")}>
                  <td className="p-3 font-bold">{r.user}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {r.screens.map((s) => <Badge key={s} color="blue">{s}</Badge>)}
                      {(r.facilityFields || []).map((f) => <Badge key={f} color="amber">{f}</Badge>)}
                    </div>
                  </td>
                  <td className="p-3">{r.perms}</td>
                  <td className="p-3 text-right"><button onClick={() => startEdit(r)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold">수정</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function BusPage({ busRows, setBusRows, setNotices }) {
  const [msg, setMsg] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const confirm = () => {
    setBusRows(busRows.map((b) => ({ ...b, status: "확정", time: confirmTimes[b.id] || b.time })));
    setMsg("노선 시간이 확정되어 교육생 포털에 자동 반영되었습니다.");
    setNotices((prev) => [{ id: Date.now(), title: "버스 시간이 확정되었습니다.", body: "교육생 포털에서 확정된 노선 및 시간을 확인할 수 있습니다.", time: "방금", unread: true, urgent: false }, ...prev]);
  };
  const vendorList = students.filter((s) => s.bus !== "자차").slice(0, 8);
  return (
    <>
      <PageTitle title="버스관리" sub={`${course.name} · 노선/요일 수요조사 후 담당자가 시간 확정`} action={<div className="flex flex-wrap gap-2"><button onClick={() => { setVendorOpen(true); setMsg("업체 제출용 명단 미리보기가 생성되었습니다."); }} className="rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200"><FileDown size={16} className="inline" /> 업체명단 생성</button><button onClick={confirm} className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">노선/시간 확정</button></div>} />
      {msg && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">{msg}</div>}
      <div className="grid gap-4 md:grid-cols-4"><KPI title="수요조사" value="95명" sub="자차 11명 포함" icon={Users} /><KPI title="차량" value="4대" sub="입·퇴소 포함" icon={Bus} /><KPI title="탑승완료" value={`${busRows.reduce((a,b)=>a+b.boarded,0)}명`} sub="실시간 집계" icon={CheckCircle2} /><KPI title="미탑승" value="23명" sub="확인 필요" icon={Search} /></div>
      <Card className="mt-5"><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">구분</th><th className="p-3">노선</th><th className="p-3">요일</th><th className="p-3">확정시간</th><th className="p-3">차량</th><th className="p-3">예약</th><th className="p-3">상태</th></tr></thead><tbody className="divide-y divide-slate-100">{busRows.map((b) => <tr key={b.id}><td className="p-3 font-bold">{b.type}</td><td className="p-3">{b.route}</td><td className="p-3">{b.day}</td><td className="p-3">{b.time}</td><td className="p-3">{b.vehicle}</td><td className="p-3">{b.reserved}/{b.seats}</td><td className="p-3"><Badge color={b.status === "확정" ? "green" : "amber"}>{b.status}</Badge></td></tr>)}</tbody></table></div></Card>
      {vendorOpen && <Card className="mt-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-black">업체 제출용 명단 미리보기</h2><p className="mt-1 text-xs text-slate-500">엑셀/CSV 다운로드 시 노선별 탑승자 명단으로 생성되는 형식</p></div><Badge color="blue">CSV 생성</Badge></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">노선</th><th className="p-3">요일</th><th className="p-3">차량</th><th className="p-3">성명</th><th className="p-3">소속</th><th className="p-3">연락처</th><th className="p-3">좌석</th><th className="p-3">탑승</th></tr></thead><tbody className="divide-y divide-slate-100">{vendorList.map((s) => <tr key={s.id}><td className="p-3">{s.bus}</td><td className="p-3">{s.day}</td><td className="p-3">{s.bus === "광주송정역" ? "1호차" : s.bus === "부산역" ? "2호차" : "3호차"}</td><td className="p-3 font-bold">{s.name}</td><td className="p-3">{s.dept}</td><td className="p-3">{s.phone}</td><td className="p-3">{s.seat}</td><td className="p-3"><Badge color={s.boarded ? "green" : "amber"}>{s.boarded ? "탑승" : "미탑승"}</Badge></td></tr>)}</tbody></table></div></Card>}
    </>
  );
}

// ---------- 운영준비: 시간표 병합(합반) 변환기 ----------
// 탭 구분 입력: 반 · 시작시간 · 종료시간 · 과목명 · 강의실
function stripClassSuffix(label) {
  return label.trim().replace(/반$/, "");
}

function parseScheduleInput(raw) {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const rows = [];
  let skipped = 0;
  for (const line of lines) {
    const parts = line.split("\t").map((p) => p.trim());
    if (parts.length !== 5 || parts.some((p) => !p)) {
      skipped++;
      continue;
    }
    const [cls, start, end, subject, room] = parts;
    rows.push({ cls, start, end, subject, room });
  }
  return { rows, skipped };
}

function mergeSchedule(rows) {
  const groups = new Map();
  for (const r of rows) {
    const key = `${r.start}|${r.end}|${r.subject}`;
    if (!groups.has(key)) {
      groups.set(key, { start: r.start, end: r.end, subject: r.subject, classes: [], rooms: [] });
    }
    const g = groups.get(key);
    if (!g.classes.includes(r.cls)) g.classes.push(r.cls);
    if (!g.rooms.includes(r.room)) g.rooms.push(r.room);
  }
  const merged = Array.from(groups.values()).map((g) => ({
    classLabel: g.classes.map(stripClassSuffix).join("+") + "반",
    start: g.start,
    end: g.end,
    subject: g.subject,
    room: g.rooms.join("/"),
    isMerged: g.classes.length > 1,
  }));
  merged.sort((a, b) => (a.start === b.start ? a.end.localeCompare(b.end) : a.start.localeCompare(b.start)));
  return merged;
}

function ScheduleConverter() {
  const [raw, setRaw] = useState("");
  const [copyState, setCopyState] = useState("idle"); // idle | copied | manual
  const outputRef = useRef(null);

  const { rows, skipped } = useMemo(() => parseScheduleInput(raw), [raw]);
  const merged = useMemo(() => mergeSchedule(rows), [rows]);
  const outputText = useMemo(
    () => merged.map((m) => [m.classLabel, m.start, m.end, m.subject, m.room].join("\t")).join("\n"),
    [merged]
  );

  function flashCopyState(state) {
    setCopyState(state);
    setTimeout(() => setCopyState("idle"), 2000);
  }

  function fallbackCopy() {
    const el = outputRef.current;
    if (!el) return;
    el.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    flashCopyState(ok ? "copied" : "manual");
  }

  function handleCopy() {
    if (!outputText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputText).then(() => flashCopyState("copied"), fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  return (
    <Card>
      <h2 className="mb-1 font-black">A/B반 시간표 병합</h2>
      <p className="mb-3 text-xs text-slate-500">탭 구분 형식: 반 · 시작시간 · 종료시간 · 과목명 · 강의실 (한 줄에 한 과목)</p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={"A반\t09:00\t10:30\t디지털 행정혁신 이론\t201호\nB반\t09:00\t10:30\t디지털 행정혁신 이론\t201호"}
        className="h-32 w-full rounded-xl border border-slate-200 p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-[#173F4F]"
      />
      {skipped > 0 && (
        <div className="mt-1 text-xs font-bold text-amber-600">형식이 맞지 않아 무시된 줄 {skipped}개 (탭 구분 5개 항목이어야 합니다)</div>
      )}

      {merged.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-black">합반 결과 ({merged.length}건)</h3>
            <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg bg-[#173F4F] px-3 py-1.5 text-xs font-bold text-white">
              <Copy size={13} /> {copyState === "copied" ? "복사됨!" : "복사"}
            </button>
          </div>
          {copyState === "manual" && (
            <div className="mb-2 text-xs font-bold text-amber-600">
              자동 복사가 지원되지 않는 환경입니다. 아래 결과가 자동 선택되었으니 Ctrl+C로 복사해주세요.
            </div>
          )}
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="p-3">반</th><th className="p-3">시작</th><th className="p-3">종료</th><th className="p-3">과목</th><th className="p-3">강의실</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {merged.map((m, i) => (
                <tr key={i}>
                  <td className="p-3 font-bold">{m.classLabel}{m.isMerged && <span className="ml-1.5"><Badge color="blue">합반</Badge></span>}</td>
                  <td className="p-3 font-mono">{m.start}</td>
                  <td className="p-3 font-mono">{m.end}</td>
                  <td className="p-3">{m.subject}</td>
                  <td className="p-3 text-slate-500">{m.room}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <textarea ref={outputRef} readOnly value={outputText} className="mt-2 h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-500" />
        </div>
      )}

      {!raw && (
        <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400 ring-1 ring-slate-100">
          위 입력창에 A/B반 시간표를 붙여넣으면 같은 시간대·같은 과목명이 자동으로 합반 처리됩니다.
        </div>
      )}
    </Card>
  );
}

// ---------- 운영준비: PDF 합본 도구 ----------
function PdfMergeTool() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);

  function addFiles(fileList) {
    const pdfs = Array.from(fileList).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfs.length === 0) return;
    setFiles((prev) => [...prev, ...pdfs.map((file) => ({ id: `${Date.now()}_${Math.random()}`, file }))]);
    setDownloadUrl(null);
    setError("");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function moveFile(index, dir) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDownloadUrl(null);
  }

  async function handleMerge() {
    if (files.length === 0) return;
    setMerging(true);
    setError("");
    try {
      const mergedPdf = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(src, src.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "합본.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError("PDF 병합 중 오류가 발생했습니다. 손상되지 않은 PDF 파일인지 확인해주세요.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-1 font-black">PDF 합본</h2>
      <p className="mb-3 text-xs text-slate-500">여러 PDF를 순서대로 하나로 합쳐 다운로드합니다.</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cx("cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors", dragOver ? "border-[#173F4F] bg-slate-50" : "border-slate-200")}
      >
        <input ref={fileInputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <Upload size={22} className="mx-auto mb-2 text-[#173F4F]" />
        <div className="text-sm font-bold text-slate-700">PDF 파일을 드래그하거나 클릭해서 업로드</div>
        <div className="mt-1 text-xs text-slate-400">여러 개 선택 가능</div>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={f.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
              <div className="flex min-w-0 items-center gap-2">
                <FileText size={15} className="shrink-0 text-[#173F4F]" />
                <span className="truncate text-sm text-slate-700">{i + 1}. {f.file.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="rounded p-1 text-slate-500 hover:bg-white disabled:text-slate-200"><ChevronUp size={15} /></button>
                <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="rounded p-1 text-slate-500 hover:bg-white disabled:text-slate-200"><ChevronDown size={15} /></button>
                <button onClick={() => removeFile(f.id)} className="rounded p-1 text-rose-500 hover:bg-white"><X size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-rose-200">{error}</div>}

      <button
        onClick={handleMerge}
        disabled={files.length === 0 || merging}
        className={cx("mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white", files.length === 0 || merging ? "bg-slate-300" : "bg-[#173F4F]")}
      >
        {merging ? "합본 생성 중…" : <><FileText size={16} /> 합본 PDF 생성</>}
      </button>

      {downloadUrl && (
        <a href={downloadUrl} download="합본.pdf" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-bold text-[#173F4F] ring-1 ring-slate-200">
          <Download size={16} /> 다시 다운로드
        </a>
      )}
    </Card>
  );
}

// ---------- 운영준비: 시간표 편집 ----------
function parseScheduleEdit(raw) {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const rows = [];
  let skipped = 0;
  for (const line of lines) {
    const parts = line.split("\t").map((p) => p.trim());
    if (parts.length !== 5 || parts.some((p) => !p)) {
      skipped++;
      continue;
    }
    const [day, start, end, title, room] = parts;
    rows.push({ id: Date.now() + Math.random(), day, time: `${start}~${end}`, title, room });
  }
  return { rows, skipped };
}

function ScheduleEditor({ scheduleRows, setScheduleRows, setNotices }) {
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ day: "", start: "", end: "", title: "", room: "" });
  const [addOpen, setAddOpen] = useState(false);

  const notifyUpdated = () => {
    setNotices((prev) => [{ id: Date.now(), title: "시간표가 변경되었습니다.", body: "교육생 포털의 시간표/강의실 정보가 최신 자료로 반영되었습니다.", time: "방금", unread: true, urgent: false }, ...prev]);
  };

  function handlePaste() {
    const { rows } = parseScheduleEdit(pasteText);
    if (rows.length === 0) return;
    setScheduleRows(rows);
    notifyUpdated();
    setPasteMode(false);
    setPasteText("");
  }

  function startEdit(row) {
    setEditId(row.id);
    const [start = "", end = ""] = row.time.split("~");
    setForm({ day: row.day, start, end, title: row.title, room: row.room });
  }

  function saveEdit() {
    setScheduleRows(scheduleRows.map((r) => (r.id === editId ? { ...r, day: form.day, time: `${form.start}~${form.end}`, title: form.title, room: form.room } : r)));
    notifyUpdated();
    setEditId(null);
  }

  function deleteRow(id) {
    setScheduleRows(scheduleRows.filter((r) => r.id !== id));
    notifyUpdated();
  }

  function addRow() {
    setScheduleRows([...scheduleRows, { id: Date.now(), day: form.day, time: `${form.start}~${form.end}`, title: form.title, room: form.room }]);
    notifyUpdated();
    setForm({ day: "", start: "", end: "", title: "", room: "" });
    setAddOpen(false);
  }

  const grouped = scheduleRows.reduce((acc, row) => {
    (acc[row.day] ||= []).push(row);
    return acc;
  }, {});

  return (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-black">시간표 편집</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setPasteMode((v) => !v)} className={cx("rounded-full px-3 py-1.5 text-xs font-bold ring-1", pasteMode ? "bg-[#173F4F] text-white ring-[#173F4F]" : "bg-white text-slate-500 ring-slate-200")}>엑셀 붙여넣기</button>
          <button onClick={() => setAddOpen((v) => !v)} className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white">+ 직접 추가</button>
        </div>
      </div>
      <p className="mb-3 text-xs text-slate-500">저장 즉시 교육생 포털의 시간표/강의실 정보에 반영됩니다.</p>

      {pasteMode && (
        <div className="mb-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 text-xs leading-relaxed text-slate-500">
            엑셀에서 복사 후 아래에 붙여넣기 (탭 구분)<br />
            <span className="rounded bg-slate-200 px-1 font-mono">요일 · 시작 · 종료 · 강의명 · 강의실</span>
          </div>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"월\t09:00\t10:00\t입교식 및 과정 안내\t대강당\n월\t10:10\t12:00\t공단 이해 및 직무 기본\tA-201"}
            className="h-28 w-full resize-none rounded-lg border border-slate-200 p-2.5 font-mono text-xs outline-none focus:ring-2 focus:ring-[#173F4F]"
          />
          <div className="mt-2 flex gap-2">
            <button onClick={handlePaste} className="rounded-lg bg-[#173F4F] px-4 py-1.5 text-xs font-bold text-white">적용 (기존 시간표 교체)</button>
            <button onClick={() => { setPasteMode(false); setPasteText(""); }} className="text-xs text-slate-400 underline">취소</button>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
          {[
            { key: "day", ph: "요일 (월)" },
            { key: "start", ph: "시작 (09:00)" },
            { key: "end", ph: "종료 (10:00)" },
            { key: "title", ph: "강의명" },
            { key: "room", ph: "강의실 (201호)" },
          ].map((f) => (
            <input key={f.key} value={form[f.key]} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} placeholder={f.ph} className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
          ))}
          <div className="col-span-3 mt-1 flex gap-2">
            <button onClick={addRow} className="rounded-lg bg-[#173F4F] px-4 py-1.5 text-xs font-bold text-white">추가</button>
            <button onClick={() => setAddOpen(false)} className="text-xs text-slate-400 underline">취소</button>
          </div>
        </div>
      )}

      {Object.keys(grouped).sort().map((day) => (
        <div key={day} className="mb-4">
          <div className="mb-2 text-xs font-bold text-slate-500">{day}요일</div>
          <div className="space-y-1.5">
            {grouped[day].sort((a, b) => a.time.localeCompare(b.time)).map((row) =>
              editId === row.id ? (
                <div key={row.id} className="grid grid-cols-3 gap-1.5 rounded-lg bg-slate-50 p-2 ring-1 ring-[#173F4F]">
                  {[
                    { key: "start", ph: "시작", w: 1 },
                    { key: "end", ph: "종료", w: 1 },
                    { key: "day", ph: "요일", w: 1 },
                    { key: "title", ph: "강의명", w: 2 },
                    { key: "room", ph: "강의실", w: 1 },
                  ].map((f) => (
                    <input key={f.key} value={form[f.key]} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} placeholder={f.ph} className={cx("rounded border border-slate-200 bg-white px-2 py-1 text-xs", f.w === 2 && "col-span-2")} />
                  ))}
                  <div className="col-span-3 flex gap-1.5">
                    <button onClick={saveEdit} className="rounded-lg bg-[#173F4F] px-3 py-1 text-[11px] font-bold text-white">저장</button>
                    <button onClick={() => setEditId(null)} className="text-[11px] text-slate-400 underline">취소</button>
                  </div>
                </div>
              ) : (
                <div key={row.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                  <span className="w-24 shrink-0 font-mono text-[11px] text-slate-400">{row.time}</span>
                  <span className="flex-1 truncate text-sm text-slate-700">{row.title}</span>
                  <span className="shrink-0 font-mono text-[11px] font-bold text-[#173F4F]">{row.room}</span>
                  <button onClick={() => startEdit(row)} className="shrink-0 text-[11px] text-slate-400 hover:text-slate-600">수정</button>
                  <button onClick={() => deleteRow(row.id)} className="shrink-0 text-[11px] text-rose-400 hover:text-rose-600">삭제</button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
      {scheduleRows.length === 0 && <div className="py-10 text-center text-sm text-slate-400">등록된 시간표가 없습니다.<br />엑셀 붙여넣기 또는 직접 추가로 등록하세요.</div>}
    </Card>
  );
}

function OperationPrepPage({ scheduleRows, setScheduleRows, setNotices }) {
  const [subTab, setSubTab] = useState("schedule");
  return (
    <>
      <PageTitle title="운영준비" sub="시간표 편집·병합과 PDF 합본을 한 곳에서 처리합니다" />
      <div className="mb-4 flex w-fit rounded-full bg-slate-100 p-0.5">
        {[["edit", "시간표 편집"], ["schedule", "시간표 변환기"], ["pdf", "PDF 합본"]].map(([key, label]) => (
          <button key={key} onClick={() => setSubTab(key)} className={cx("rounded-full px-4 py-1.5 text-xs font-bold", subTab === key ? "bg-[#173F4F] text-white" : "text-slate-500")}>
            {label}
          </button>
        ))}
      </div>
      {subTab === "edit" && <ScheduleEditor scheduleRows={scheduleRows} setScheduleRows={setScheduleRows} setNotices={setNotices} />}
      {subTab === "schedule" && <ScheduleConverter />}
      {subTab === "pdf" && <PdfMergeTool />}
    </>
  );
}

function NoticePage({ notices, setNotices, scheduleRows, setScheduleRows }) {
  const [title, setTitle] = useState("퇴소버스 2차 수요조사 안내");
  const [body, setBody] = useState("오늘 18시까지 퇴소버스 이용 여부를 선택해 주세요.");
  const [urgent, setUrgent] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sent, setSent] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setUrgent(false);
    setEditingId(null);
  };

  const sendNotice = () => {
    if (!title.trim() || !body.trim()) return;
    if (editingId) {
      setNotices(notices.map((n) => (n.id === editingId ? { ...n, title, body, urgent } : n)));
    } else {
      setNotices([{ id: Date.now(), title, body, time: "방금", unread: true, urgent }, ...notices]);
    }
    setSent(true);
    resetForm();
  };

  const editNotice = (n) => {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body);
    setUrgent(!!n.urgent);
    setSent(false);
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter((n) => n.id !== id));
    if (editingId === id) resetForm();
  };

  const uploadSchedule = () => {
    setScheduleRows(uploadedScheduleRows);
    setUploaded(true);
    setNotices((prev) => [{ id: Date.now(), title: "시간표가 변경되었습니다.", body: "교육생 포털의 시간표/강의실 정보가 최신 자료로 반영되었습니다.", time: "방금", unread: true, urgent: false }, ...prev]);
  };

  return (
    <>
      <PageTitle title="공지/안내" sub="직접 작성한 공지와 업로드한 시간표가 교육생 포털에 즉시 반영" action={<button onClick={uploadSchedule} className="rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200">시간표 업로드</button>} />
      {sent && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">공지와 알림이 발송되었습니다.</div>}
      {uploaded && <div className="mb-4 rounded-xl bg-sky-50 p-3 text-sm font-bold text-sky-700">시간표_신임자3기.xlsx 업로드 완료 · 교육생 화면에 즉시 반영</div>}
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-black">{editingId ? "공지 수정" : "공지 작성"}</h2>
            {editingId && <button onClick={resetForm} className="text-xs font-bold text-slate-400">취소</button>}
          </div>
          <label className="mt-3 block text-xs font-bold text-slate-500">중요도</label>
          <div className="mt-1 flex gap-2">
            {[["일반", false], ["긴급", true]].map(([label, val]) => (
              <button
                key={label}
                onClick={() => setUrgent(val)}
                className={cx(
                  "flex-1 rounded-xl py-2 text-sm font-bold ring-1",
                  urgent === val
                    ? val
                      ? "bg-rose-600 text-white ring-rose-600"
                      : "bg-[#173F4F] text-white ring-[#173F4F]"
                    : "bg-white text-slate-600 ring-slate-200"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-xs font-bold text-slate-500">제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-[#173F4F]" />
          <label className="mt-4 block text-xs font-bold text-slate-500">내용</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-[#173F4F]" />
          <button onClick={sendNotice} className={cx("mt-4 w-full rounded-xl py-3 text-sm font-bold text-white", urgent ? "bg-rose-600" : "bg-[#173F4F]")}>{editingId ? "수정 완료" : "공지 발송"}</button>
        </Card>
        <Card>
          <h2 className="mb-3 font-black">현재 시간표</h2>
          {scheduleRows.map((s) => <div key={`${s.day}-${s.time}-${s.title}`} className="mb-2 rounded-xl bg-slate-50 p-3"><b className="text-sm">{s.title}</b><div className="text-xs text-slate-500">{s.day} · {s.time} · {s.room}</div></div>)}
        </Card>
      </div>
      <Card className="mt-5">
        <h2 className="mb-3 font-black">공지 목록 관리</h2>
        {notices.length === 0 && <p className="text-sm text-slate-400">등록된 공지가 없습니다.</p>}
        {notices.map((n) => (
          <div key={n.id} className={cx("mb-3 rounded-xl p-4 ring-1", n.urgent ? "bg-rose-50 ring-rose-200" : "bg-slate-50 ring-slate-100")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {n.urgent && <Badge color="red">긴급</Badge>}
                <b>{n.title}</b>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={n.unread ? "blue" : "slate"}>{n.unread ? "미확인" : "확인"}</Badge>
                <span className="text-xs text-slate-400">{n.time}</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-500">{n.body}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => editNotice(n)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold ring-1 ring-slate-200">수정</button>
              <button onClick={() => deleteNotice(n.id)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200">삭제</button>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

function RoomPage({ roomOpen, setRoomOpen }) {
  const [assigned, setAssigned] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const assignedRows = useMemo(() => autoAssignRoom(students), []);
  const rooms = assignedRows.reduce((a, s) => ((a[s.room] = [...(a[s.room] || []), s]), a), {});
  return <><PageTitle title="객실관리" sub="4인실 기준 객실 신청 및 자동배정" action={<div className="flex flex-wrap gap-2"><button onClick={() => { setRoomOpen(true); setAssigned(false); setFinalized(false); }} className="rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200">신청기간 열기</button><button onClick={() => setRoomOpen(false)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">신청기간 종료</button></div>} /><div className="grid gap-4 md:grid-cols-4"><KPI title="신청상태" value={roomOpen ? "진행중" : "종료"} sub="객실담당자 권한" icon={CalendarDays} /><KPI title="신청인원" value="96명" sub="전체 교육생" icon={Users} /><KPI title="예외요청" value="5건" sub="동일객실/건강상" icon={FileText} /><KPI title="배정상태" value={finalized ? "확정" : assigned ? "검토" : "대기"} sub="남녀 분리" icon={BedDouble} /></div><Card className="mt-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-black">자동배정</h2><div className="flex flex-wrap gap-2"><button disabled={roomOpen} onClick={() => setAssigned(true)} className={cx("rounded-xl px-4 py-2 text-sm font-bold text-white", roomOpen ? "bg-slate-300" : "bg-[#173F4F]")}>자동배정 실행</button><button disabled={!assigned} onClick={() => setFinalized(true)} className={cx("rounded-xl px-4 py-2 text-sm font-bold text-white", assigned ? "bg-emerald-600" : "bg-slate-300")}>배정확정</button></div></div>{roomOpen && <div className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-700">신청기간 종료 후 자동배정을 실행할 수 있습니다.</div>}{finalized && <div className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">배정이 확정되어 교육생 포털에 표시됩니다.</div>}<div className="mt-4 grid gap-3 xl:grid-cols-3">{Object.entries(rooms).map(([room, people]) => <div key={room} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="mb-3 flex justify-between"><b>{room}</b><Badge color={people[0].gender === "남" ? "blue" : "purple"}>{people[0].gender} {people.length}/4</Badge></div>{people.map((p) => <div key={p.id} className="mb-2 rounded-xl bg-white p-3 text-sm"><b>{p.name}</b><span className="ml-2 text-xs text-slate-500">{p.region} · {p.age}세 · {p.rank}</span>{p.request && <div className="mt-1 text-xs text-amber-700">{p.request}</div>}</div>)}</div>)}</div></Card></>;
}

function MealPage({ mealMenu, setMealMenu, setNotices }) {
  const [checked, setChecked] = useState(students.reduce((a, s) => ({ ...a, [s.id]: s.meal }), {}));
  const [uploaded, setUploaded] = useState(false);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const uploadMeal = () => {
    setMealMenu(uploadedMealMenu);
    setUploaded(true);
    setNotices((prev) => [{ id: Date.now(), title: "식단표가 등록되었습니다.", body: "교육생 포털의 오늘 식단이 최신 식단표로 반영되었습니다.", time: "방금", unread: true, urgent: false }, ...prev]);
  };
  return <><PageTitle title="식당관리" sub="식단표 업로드 및 식사 확인" action={<div className="flex flex-wrap gap-2"><button onClick={uploadMeal} className="rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200">식단표 업로드</button><button onClick={() => setChecked(students.reduce((a, s) => ({ ...a, [s.id]: true }), {}))} className="rounded-xl bg-[#173F4F] px-4 py-2 text-sm font-bold text-white">QR 일괄 확인</button></div>} />{uploaded && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">식단표 업로드 완료 · 교육생 포털에 즉시 반영되었습니다.</div>}<div className="grid gap-4 md:grid-cols-4"><KPI title="조식" value="92명" sub="예정" icon={Utensils} /><KPI title="중식" value="96명" sub="예정" icon={Utensils} /><KPI title="식사확인" value={`${checkedCount}/12`} sub="QR 확인" icon={QrCode} /><KPI title="식단표" value={mealMenu.updatedAt.includes("업로드") ? "등록" : "대기"} sub={mealMenu.updatedAt} icon={FileText} /></div><div className="mt-5 grid gap-5 xl:grid-cols-2"><Card><h2 className="mb-3 font-black">현재 식단표</h2>{Object.entries({ 조식: mealMenu.breakfast, 중식: mealMenu.lunch, 석식: mealMenu.dinner }).map(([k, v]) => <div key={k} className="mb-2 rounded-xl bg-slate-50 p-3"><b>{k}</b><p className="text-sm text-slate-600">{v}</p></div>)}</Card><Card><h2 className="mb-3 font-black">식사 확인</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{students.slice(0, 8).map((s) => <tr key={s.id}><td className="p-3 font-bold">{s.name}</td><td className="p-3">중식</td><td className="p-3">{checked[s.id] ? <Badge color="green">확인</Badge> : <Badge color="amber">미확인</Badge>}</td><td className="p-3 text-right"><button onClick={() => setChecked({ ...checked, [s.id]: !checked[s.id] })} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold">{checked[s.id] ? "취소" : "확인"}</button></td></tr>)}</tbody></table></div></Card></div></>;
}

function FacilityPage({ facilityRows, setFacilityRows, assignedFields }) {
  const changeStatus = (id, status) => setFacilityRows(facilityRows.map((x) => x.id === id ? { ...x, status } : x));
  const statusColor = { 접수: "slate", 처리중: "amber", 완료: "green" };
  const rows = facilityRows.filter((r) => assignedFields.includes(r.field));
  const subText = assignedFields.length > 0 ? `담당 분야(${assignedFields.join("·")}) 신고를 접수·처리중·완료 버튼으로 변경` : "담당 분야가 없습니다. 관리자에게 권한 부여를 요청하세요.";
  return (
    <>
      <PageTitle title="시설처리" sub={subText} />
      <Card>
        {rows.length === 0 && <div className="p-6 text-center text-sm text-slate-400">{assignedFields.length === 0 ? "부여된 담당 분야가 없어 신고 내역이 표시되지 않습니다." : "접수된 담당 분야 신고가 없습니다."}</div>}
        {rows.map((r) => <div key={r.id} className="mb-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap gap-2"><Badge color="blue">{r.field}</Badge><span className="text-xs text-slate-400">{r.time}</span></div><div className="mt-2 font-black">{r.title}</div><div className="text-sm text-slate-500">{r.place}</div></div><div className="flex flex-wrap items-center gap-2"><Badge color={statusColor[r.status]}>{r.status}</Badge>{["접수", "처리중", "완료"].map((s) => <button key={s} onClick={() => changeStatus(r.id, s)} className={cx("rounded-xl px-3 py-2 text-xs font-bold ring-1", r.status === s ? "bg-[#173F4F] text-white ring-[#173F4F]" : "bg-white text-slate-600 ring-slate-200")}>{s}</button>)}</div></div></div>)}
      </Card>
    </>
  );
}

function BoardingPage({ busRows, setBusRows }) {
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState(null);
  const list = students.filter((s) => s.bus !== "자차" && (s.name.includes(q) || s.seat.includes(q) || s.bus.includes(q)));
  const checkStudent = (s) => { setChecked(s); setBusRows(busRows.map((b) => b.id === "A1" ? { ...b, boarded: Math.min(b.reserved, b.boarded + 1) } : b)); };
  return <div className="mx-auto max-w-md"><PageTitle title="탑승확인" sub="광주송정역 1호차" /><Card className="bg-slate-950 text-white"><div className="flex justify-between"><div><div className="text-sm text-slate-300">입소버스</div><div className="text-2xl font-black">광주송정역 1호차</div></div><QrCode /></div><div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-white/10 p-3"><b>34</b><div className="text-xs">예약</div></div><div className="rounded-xl bg-white/10 p-3"><b>{busRows[0].boarded}</b><div className="text-xs">탑승</div></div><div className="rounded-xl bg-white/10 p-3"><b>{Math.max(0, busRows[0].reserved - busRows[0].boarded)}</b><div className="text-xs">미탑승</div></div></div></Card><Card className="mt-4"><button onClick={() => checkStudent(list[0])} className="mb-3 w-full rounded-xl bg-[#173F4F] py-3 font-bold text-white">QR 스캔</button><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름/좌석 검색" className="mb-3 w-full rounded-xl border border-slate-200 p-3" />{checked && <div className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{checked.name} 정상 탑승 처리</div>}{list.slice(0, 6).map((s) => <button key={s.id} onClick={() => checkStudent(s)} className="mb-2 flex w-full justify-between rounded-xl bg-slate-50 p-3 text-left"><span><b>{s.name}</b><div className="text-xs text-slate-500">{s.bus} · {s.seat}</div></span>{s.boarded ? <Badge color="green">탑승</Badge> : <Badge color="amber">미탑승</Badge>}</button>)}</Card></div>;
}

function BusSeatMap({ bus, mySeat, onSelect }) {
  const seats = Array.from({ length: bus.seats }, (_, i) => {
    const row = Math.floor(i / 4) + 1;
    const col = "ABCD"[i % 4];
    return `${row}${col}`;
  });
  return (
    <div className="grid grid-cols-4 gap-2">
      {seats.map((label, i) => {
        const isMine = label === mySeat;
        const isTaken = i < bus.reserved && !isMine;
        return (
          <button
            key={label}
            disabled={isTaken}
            onClick={() => onSelect(label)}
            className={cx(
              "rounded-lg py-2 text-xs font-bold",
              isMine
                ? "bg-[#173F4F] text-white"
                : isTaken
                ? "cursor-not-allowed bg-slate-100 text-slate-300"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-2 hover:ring-[#173F4F]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function StudentMobile({ notices, setNotices, scheduleRows, mealMenu, busRows }) {
  const [tab, setTab] = useState("home");
  const [submitted, setSubmitted] = useState(false);
  const [roomText, setRoomText] = useState("동일객실: 교육생02");
  const [arrival, setArrival] = useState("광주송정역");
  const [arrivalDay, setArrivalDay] = useState("월요일");
  const [depart, setDepart] = useState("광주송정역");
  const [departDay, setDepartDay] = useState("금요일");
  const [busSubmitted, setBusSubmitted] = useState(false);
  const [openNoticeId, setOpenNoticeId] = useState(null);
  const [mySeat, setMySeat] = useState(null);
  const [seatPickerOpen, setSeatPickerOpen] = useState(false);
  const confirmedBus = busRows.find((b) => b.route === arrival && b.day === arrivalDay && b.status === "확정");
  const submitBus = () => {
    setBusSubmitted(true);
    setNotices([{ id: Date.now(), title: "버스 수요조사 제출 완료", body: `입소 ${arrival} ${arrivalDay}, 퇴소 ${depart} ${departDay}로 제출되었습니다. 시간은 담당자 확정 후 안내됩니다.`, time: "방금", unread: true, urgent: false }, ...notices]);
  };
  const reserveSeat = (label) => {
    setMySeat(label);
    setSeatPickerOpen(false);
    setNotices([{ id: Date.now(), title: "버스 좌석 예약 완료", body: `${confirmedBus.route} ${confirmedBus.day} ${confirmedBus.time} · ${confirmedBus.vehicle} 좌석 ${label}로 예약되었습니다.`, time: "방금", unread: true, urgent: false }, ...notices]);
  };
  const unreadCount = notices.filter((n) => n.unread).length;
  const bannerNotice = notices.find((n) => n.unread && n.urgent) || notices.find((n) => n.unread);
  const openNotice = (n) => {
    setOpenNoticeId((prev) => (prev === n.id ? null : n.id));
    if (n.unread) setNotices(notices.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
  };

  return (
    <div className="mx-auto w-full max-w-md sm:py-6">
      <div className="flex h-[calc(100dvh-4rem)] flex-col bg-white sm:h-[42rem] sm:overflow-hidden sm:rounded-[2rem] sm:shadow-sm sm:ring-1 sm:ring-slate-200">
        <div className="shrink-0 bg-[#173F4F] p-5 text-white">
          <div className="text-sm text-teal-100">신임자 과정 3기</div>
          <div className="mt-1 text-2xl font-black">교육생01</div>
        </div>
        {bannerNotice && (
          <button
            onClick={() => { setTab("notice"); openNotice(bannerNotice); }}
            className={cx("flex shrink-0 w-full items-center gap-2 px-5 py-3 text-left text-sm font-bold", bannerNotice.urgent ? "bg-rose-600 text-white" : "bg-sky-50 text-sky-700")}
          >
            <Bell size={16} />
            <span className="flex-1 truncate">{bannerNotice.urgent ? "[긴급] " : ""}{bannerNotice.title}</span>
            <span className="text-xs font-normal opacity-80">자세히</span>
          </button>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {tab === "home" && <div className="grid gap-3"><KPI title="내 객실" value={submitted ? "신청완료" : "201호"} sub={submitted ? "객실담당자 검토 대기" : "배정 완료"} icon={BedDouble} /><KPI title="강의실" value={scheduleRows[0]?.room || "A-201"} sub={scheduleRows[0]?.title || course.classroom} icon={ClipboardCheck} /><KPI title="입소 버스" value={mySeat ? `좌석 ${mySeat}` : busSubmitted ? arrival : "수요조사"} sub={mySeat ? "예약 완료" : confirmedBus ? `${confirmedBus.day} ${confirmedBus.time} 확정 · 좌석 선택 필요` : busSubmitted ? "시간 확정 대기" : "신청 필요"} icon={Bus} /></div>}
          {tab === "schedule" && <div><h2 className="mb-3 font-black">시간표/강의실</h2>{scheduleRows.map((s) => <div key={`${s.day}-${s.time}-${s.title}`} className="mb-2 rounded-xl bg-slate-50 p-3"><b>{s.title}</b><div className="text-xs text-slate-500">{s.day} · {s.time} · {s.room}</div></div>)}</div>}
          {tab === "meal" && <div><h2 className="mb-3 font-black">오늘 식단</h2>{Object.entries({ 조식: mealMenu.breakfast, 중식: mealMenu.lunch, 석식: mealMenu.dinner }).map(([k,v]) => <div key={k} className="mb-2 rounded-xl bg-slate-50 p-3"><b>{k}</b><p className="text-sm text-slate-600">{v}</p></div>)}</div>}
          {tab === "bus" && (
            <div>
              <h2 className="font-black">버스 수요조사</h2>
              <p className="mt-1 text-xs text-slate-500">교육생은 노선과 요일만 선택합니다. 시간은 담당자가 확정하면 자동 안내됩니다.</p>

              {confirmedBus ? (
                <div className="mt-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                    {confirmedBus.route} {confirmedBus.day} {confirmedBus.time} · {confirmedBus.vehicle} 확정
                  </div>

                  {mySeat ? (
                    <div className="mt-3 rounded-xl bg-[#173F4F] p-4 text-white">
                      <div className="text-xs text-teal-100">내 좌석</div>
                      <div className="mt-1 text-2xl font-black">{mySeat}</div>
                      <button onClick={() => setSeatPickerOpen((v) => !v)} className="mt-2 text-xs font-bold text-teal-100 underline">좌석 변경</button>
                    </div>
                  ) : (
                    <button onClick={() => setSeatPickerOpen((v) => !v)} className="mt-3 w-full rounded-xl bg-[#173F4F] py-3 font-bold text-white">좌석 선택하기</button>
                  )}

                  {seatPickerOpen && (
                    <div className="mt-3">
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{confirmedBus.vehicle} 좌석 선택</span>
                        <span>{confirmedBus.seats - confirmedBus.reserved}석 남음</span>
                      </div>
                      <BusSeatMap bus={confirmedBus} mySeat={mySeat} onSelect={reserveSeat} />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {busSubmitted && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">버스 수요조사가 제출되었습니다. 담당자 확정 후 좌석 선택이 열립니다.</div>}
                  <label className="mt-3 block text-xs font-bold text-slate-500">입소 노선</label>
                  <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3"><option>광주송정역</option><option>부산역</option><option>대전역</option><option>서울역</option><option>자차</option></select>
                  <label className="mt-3 block text-xs font-bold text-slate-500">입소 요일</label>
                  <select value={arrivalDay} onChange={(e) => setArrivalDay(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3"><option>월요일</option><option>화요일</option></select>
                  <label className="mt-3 block text-xs font-bold text-slate-500">퇴소 노선</label>
                  <select value={depart} onChange={(e) => setDepart(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3"><option>광주송정역</option><option>부산역</option><option>대전역</option><option>서울역</option><option>자차</option></select>
                  <label className="mt-3 block text-xs font-bold text-slate-500">퇴소 요일</label>
                  <select value={departDay} onChange={(e) => setDepartDay(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3"><option>금요일</option><option>토요일</option></select>
                  <button onClick={submitBus} className="mt-4 w-full rounded-xl bg-[#173F4F] py-3 font-bold text-white">수요조사 제출</button>
                </>
              )}
            </div>
          )}
          {tab === "room" && <div><h2 className="font-black">객실 요청</h2>{submitted && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">객실 요청이 제출되었습니다.</div>}<textarea value={roomText} onChange={(e) => setRoomText(e.target.value)} className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 p-3" /><button onClick={() => setSubmitted(true)} className="mt-3 w-full rounded-xl bg-[#173F4F] py-3 font-bold text-white">제출</button></div>}
          {tab === "notice" && (
            <div>
              <h2 className="mb-3 font-black">공지사항</h2>
              {notices.length === 0 && <p className="text-sm text-slate-400">등록된 공지가 없습니다.</p>}
              {notices.map((n) => {
                const open = openNoticeId === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => openNotice(n)}
                    className={cx("mb-2 block w-full rounded-xl p-3 text-left ring-1", n.urgent ? "bg-rose-50 ring-rose-200" : "bg-slate-50 ring-slate-100")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        {n.urgent && <Badge color="red">긴급</Badge>}
                        <b className="text-sm">{n.title}</b>
                        {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">{n.time}</span>
                    </div>
                    {open && <p className="mt-2 text-xs leading-5 text-slate-600">{n.body}</p>}
                  </button>
                );
              })}
            </div>
          )}
          {tab === "qr" && <div className="text-center"><div className="mx-auto grid h-44 w-44 grid-cols-5 gap-1 rounded-2xl bg-slate-900 p-3">{Array.from({ length: 25 }).map((_, i) => <div key={i} className={cx("rounded-sm", [0, 2, 6, 8, 12, 16, 18, 20, 22, 24].includes(i) ? "bg-white" : "bg-slate-900")} />)}</div><div className="mt-4 font-black">모바일 학생증 QR</div><div className="text-sm text-slate-500">버스·출석·식사 확인 공통 사용</div></div>}
        </div>
        <div className="grid shrink-0 grid-cols-7 border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom)]">
          {[["home", "홈"], ["schedule", "시간표"], ["meal", "식단"], ["bus", "버스"], ["room", "객실"], ["notice", "공지"], ["qr", "QR"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={cx("relative flex items-center justify-center gap-1 py-4 text-xs font-bold", tab === id ? "text-[#173F4F]" : "text-slate-400")}>
              {id === "notice" && <Bell size={14} />}
              {label}
              {id === "notice" && unreadCount > 0 && (
                <span className="absolute right-2.5 top-2 rounded-full bg-rose-500 px-1.5 text-[9px] font-black text-white">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppContent(props) {
  const { userId, page, accessRows, setAccessRows, allowedScreens } = props;
  if (userId === "admin") return page === "access" ? <AccessPage accessRows={accessRows} setAccessRows={setAccessRows} /> : <AdminDashboard {...props} />;
  if (userId === "student") return <StudentMobile {...props} />;

  if (allowedScreens.length === 0) return <NoAccessPage message="이 계정에 부여된 화면이 없습니다" />;
  const requiredScreen = PAGE_TO_SCREEN[page];
  if (requiredScreen && !allowedScreens.includes(requiredScreen)) return <NoAccessPage screen={requiredScreen} />;

  if (userId === "course") return page === "notice" ? <NoticePage {...props} /> : page === "prep" ? <OperationPrepPage {...props} /> : <BusPage {...props} />;
  if (userId === "room") return <RoomPage {...props} />;
  if (userId === "meal") return <MealPage {...props} />;
  if (userId === "facility") {
    const assignedFields = accessRows.find((r) => r.userKey === "facility")?.facilityFields || [];
    return <FacilityPage {...props} assignedFields={assignedFields} />;
  }
  return <BoardingPage {...props} />;
}

export default function SmartCampusPrototype() {
  const [credentials, setCredentials] = useState(() => Object.fromEntries(demoUsers.map((u) => [u.empId, { password: u.empId, changed: false }])));
  const [session, setSession] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [notices, setNotices] = useState(noticesSeed);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [busRows, setBusRows] = useState(initialBusRows);
  const [roomOpen, setRoomOpen] = useState(true);
  const [scheduleRows, setScheduleRows] = useState(initialScheduleRows);
  const [mealMenu, setMealMenu] = useState(initialMealMenu);
  const [facilityRows, setFacilityRows] = useState(initialFacilityRows);
  const [accessRows, setAccessRows] = useState(initialAccessRows);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [page, setPage] = useState(null);

  function enterApp(id) {
    setSession(id);
    setPage(firstPageFor(id, accessRows));
    setMobileNavOpen(false);
  }
  function handleAuthenticated(user, needsSetup) {
    if (needsSetup) setPendingUser(user.id);
    else enterApp(user.id);
  }
  function handlePasswordSet(newPassword) {
    const user = demoUsers.find((u) => u.id === pendingUser);
    setCredentials((c) => ({ ...c, [user.empId]: { password: newPassword, changed: true } }));
    setPendingUser(null);
    enterApp(user.id);
  }
  function handleLogout() {
    setSession(null);
    setPendingUser(null);
    setPage(null);
    setMobileNavOpen(false);
  }

  if (pendingUser) return <PasswordSetupScreen user={demoUsers.find((u) => u.id === pendingUser)} onSubmit={handlePasswordSet} />;
  if (!session) return <LoginScreen credentials={credentials} onAuthenticated={handleAuthenticated} />;

  const userId = session;
  const allowedScreens = getAllowedScreens(userId, accessRows);
  const unread = notices.filter((n) => n.unread).length;
  const props = { userId, page, setPage, busRows, setBusRows, roomOpen, setRoomOpen, notices, setNotices, scheduleRows, setScheduleRows, mealMenu, setMealMenu, facilityRows, setFacilityRows, accessRows, setAccessRows, allowedScreens };
  return <div className="min-h-screen bg-slate-100 text-slate-900"><TopBar userId={userId} unread={unread} onBell={() => setNoticeOpen(!noticeOpen)} onMenuClick={() => setMobileNavOpen(true)} onLogout={handleLogout} /><NotificationPanel open={noticeOpen} notices={notices} onClose={() => setNoticeOpen(false)} onReadAll={() => setNotices(notices.map((n) => ({ ...n, unread: false })))} /><div className="flex min-h-[calc(100vh-4rem)]"><Sidebar userId={userId} allowedScreens={allowedScreens} page={page} setPage={setPage} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onLogout={handleLogout} /><main className={cx("min-w-0 flex-1", userId === "student" ? "p-0 sm:p-4 lg:p-6" : "p-4 lg:p-6")}><AppContent {...props} /></main></div></div>;
}

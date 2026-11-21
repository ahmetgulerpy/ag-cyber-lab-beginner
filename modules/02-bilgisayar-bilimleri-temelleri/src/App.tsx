import { useEffect } from "react";
import { ProgressProvider, useProgress } from "./progress";
import { useHashPath } from "./router";
import { Footer, Header, Page } from "./components/Layout";
import Home from "./pages/Home";
import { LabsPage, LessonsPage } from "./pages/Lists";
import LessonView from "./pages/LessonView";
import Assessment from "./pages/Assessment";
import ProgressPage from "./pages/ProgressPage";
import type { LessonTab } from "./types";

const validTabs: LessonTab[] = ["learn", "lab", "quiz", "summary"];

function Shell() {
  const parts = useHashPath();
  const { percent } = useProgress();
  const [root, a, b] = parts;

  let active = "overview";
  let view = <Home />;
  if (root === "lessons") {
    active = "lessons";
    view = <LessonsPage />;
  } else if (root === "lesson") {
    active = "lessons";
    const id = Number(a);
    const tab = validTabs.includes(b as LessonTab) ? (b as LessonTab) : "learn";
    view = <LessonView id={id} tab={tab} />;
  } else if (root === "labs") {
    active = "labs";
    view = <LabsPage />;
  } else if (root === "assessment") {
    active = "assessment";
    view = <Assessment />;
  } else if (root === "progress") {
    active = "progress";
    view = <ProgressPage />;
  }

  useEffect(() => {
    document.title =
      active === "overview" ? "AG Cyber Lab | Modül 02 — Bilgisayar Bilimleri Temelleri" : `AG Cyber Lab | ${{ lessons: "Dersler", labs: "Uygulamalar", assessment: "Değerlendirme", progress: "İlerlemem" }[active]}`;
  }, [active]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <Header active={active} percent={percent} />
      <Page>{view}</Page>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}

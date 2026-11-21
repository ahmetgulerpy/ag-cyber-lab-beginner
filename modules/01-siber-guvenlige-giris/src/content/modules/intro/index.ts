import type { CourseModule } from "../../types";
import { lesson01 } from "./lesson-01";
import { lesson02 } from "./lesson-02";
import { lesson03 } from "./lesson-03";
import { lesson04 } from "./lesson-04";
import { lesson05 } from "./lesson-05";
import { lesson06 } from "./lesson-06";
import { lesson07 } from "./lesson-07";
import { lesson08 } from "./lesson-08";
import { finalExam } from "./final-exam";

export const introModule: CourseModule = {
  id: "siber-guvenlige-giris",
  slug: "siber-guvenlige-giris",
  code: "01",
  level: "Başlangıç",
  title: "Siber Güvenliğe Giriş",
  tagline: "Modül 01 · Başlangıç seviyesi",
  description:
    "Siber güvenliğin temel kavramlarını, tarihçesini, ekosistemini, rollerini, CIA üçlüsünü, kariyer alanlarını ve etik-yasal çerçevesini uygulamalı olarak öğren.",
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07, lesson08],
  finalExam,
  passPercent: 70,
};

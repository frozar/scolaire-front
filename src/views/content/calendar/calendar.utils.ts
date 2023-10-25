import { MonthType } from "./template/Calendar";

interface JourFerie {
  date: string;
  dayName: string;
}

export namespace CalendarUtils {
  export function getMonthName(date: Date): string {
    return date.toLocaleString("default", {
      month: "long",
    });
  }

  export function getDaysOfMonth(date: Date): number[] {
    const days = [];
    const numberOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();
    for (let i = 1; i <= numberOfDay; i++) {
      days.push(i);
    }
    return days;
  }
}

export function getAllMonthsAndDays(year: number) {
  const monthsData = [];

  for (let month = 0; month < 12; month++) {
    const monthData: MonthType = {
      month: month + 1,
      monthName: new Date(year, month, 1).toLocaleString("default", {
        month: "long",
      }),
      days: [],
    };

    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {
      monthData.days.push(day);
    }

    monthsData.push(monthData);
  }

  return monthsData as [];
}

// Fonction pour calculer la date de Pâques
function calculerPaques(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getJoursFeries(year: number): JourFerie[] {
  const joursFeries: JourFerie[] = [];

  // Fonction pour ajouter un jour férié
  function ajouterJourFerie(date: Date, dayName: string): void {
    joursFeries.push({ date: formatDate(date), dayName });
  }

  // Jour de l'An (1er janvier)
  ajouterJourFerie(new Date(year, 0, 1), "Jour de l'an");

  // Fête du Travail (1er mai)
  ajouterJourFerie(new Date(year, 4, 1), "Fête du Travail");

  // Victoire 1945 (8 mai)
  ajouterJourFerie(new Date(year, 4, 8), "Victoire 1945");

  // Fête Nationale (14 juillet)
  ajouterJourFerie(new Date(year, 6, 14), "Fête Nationale");

  // Assomption (15 août)
  ajouterJourFerie(new Date(year, 7, 15), "Assomption");

  // Toussaint (1er novembre)
  ajouterJourFerie(new Date(year, 10, 1), "Toussaint");

  // Armistice 1918 (11 novembre)
  ajouterJourFerie(new Date(year, 10, 11), "Armistice 1918");

  // Noël (25 décembre)
  ajouterJourFerie(new Date(year, 11, 25), "Noël");

  // Pâques (variable)
  const paques = calculerPaques(year);
  ajouterJourFerie(paques, "Pâques");

  // Ascension (variable)
  const ascension = new Date(paques);
  ascension.setDate(ascension.getDate() + 39);
  ajouterJourFerie(ascension, "Ascension");

  // Pentecôte (variable)
  const pentecote = new Date(paques);
  pentecote.setDate(pentecote.getDate() + 49);
  ajouterJourFerie(pentecote, "Pentecôte");

  return joursFeries;
}

// Fonction pour formater la date au format "jj-mm-aaaa"
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

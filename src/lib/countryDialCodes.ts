/** Dial codes for phone inputs (E.164-style prefix + local digits). */
export type CountryDial = {
  iso2: string;
  name: string;
  dial: string;
  flag: string;
};

export const DEFAULT_PHONE_COUNTRY_ISO = "PK";

export const COUNTRY_DIAL_LIST: CountryDial[] = [
  { iso2: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { iso2: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { iso2: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { iso2: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { iso2: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { iso2: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { iso2: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { iso2: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { iso2: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { iso2: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { iso2: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { iso2: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { iso2: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { iso2: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { iso2: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { iso2: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { iso2: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { iso2: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
  { iso2: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { iso2: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
  { iso2: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { iso2: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { iso2: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { iso2: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { iso2: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { iso2: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦" },
  { iso2: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { iso2: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { iso2: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { iso2: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { iso2: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { iso2: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { iso2: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { iso2: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { iso2: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { iso2: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { iso2: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { iso2: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { iso2: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { iso2: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { iso2: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { iso2: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { iso2: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { iso2: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { iso2: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
];

export function getCountryByIso(iso2: string): CountryDial | undefined {
  return COUNTRY_DIAL_LIST.find((c) => c.iso2 === iso2);
}

export const KAUFJAHRE = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025']

export const SENEC_MODELLE = [
  'SENEC.Home V2',
  'SENEC.Home V2.1',
  'SENEC.Home V2.5',
  'SENEC.Home V3 Hybrid',
  'SENEC.Home V3 Hybrid duo',
  'Sonstiges / Unbekannt',
]

export const DEFEKTE = [
  { id: 'totalausfall', label: 'Totalausfall', desc: 'Speicher lädt oder entlädt nicht mehr' },
  { id: 'drosselung',   label: 'Drosselung auf 70%', desc: 'SENEC hat den Speicher per Software begrenzt' },
  { id: 'teilausfall',  label: 'Teilausfall', desc: 'Speicher arbeitet, aber schlechter als erwartet' },
  { id: 'sonstiges',   label: 'Sonstiges', desc: 'Anderes Problem mit dem Speicher' },
]

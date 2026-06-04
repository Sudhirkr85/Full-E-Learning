export const COURIER_LIST = [
  { value: "postoffice", label: "Post Office", url: "https://www.indiapost.gov.in/vas/pages/trackconsignment.aspx?id=" },
  { value: "delhivery",  label: "Delhivery",   url: "https://www.delhivery.com/track/package/" },
  { value: "bluedart",   label: "BlueDart",     url: "https://www.bluedart.com/tracking?trackid=" },
  { value: "dtdc",       label: "DTDC",         url: "https://www.dtdc.in/tracking?awbno=" },
  { value: "ekart",      label: "Ekart",        url: "https://ekartlogistics.com/track?awb=" },
  { value: "xpressbees", label: "XpressBees",   url: "https://www.xpressbees.com/track?awbNo=" },
  { value: "shiprocket",  label: "Shiprocket",  url: "https://shiprocket.co/tracking/" },
  { value: "fedex",      label: "FedEx",        url: "https://www.fedex.com/fedextrack/?trknbr=" },
  { value: "amazon",     label: "Amazon",       url: "https://track.amazon.in/tracking/" },
  { value: "other",      label: "Other",        url: null },
];

export function getCourierTrackingUrl(
  courierValue: string,
  trackingNumber: string
): string | null {
  if (!trackingNumber) return null;
  const courier = COURIER_LIST.find(c => c.value === courierValue || c.label.toLowerCase() === courierValue.toLowerCase());
  if (!courier || !courier.url) return null;
  return `${courier.url}${trackingNumber}`;
}

export function getCourierLabel(courierValue: string): string {
  const courier = COURIER_LIST.find(c => c.value === courierValue || c.label.toLowerCase() === courierValue.toLowerCase());
  return courier?.label ?? courierValue;
}

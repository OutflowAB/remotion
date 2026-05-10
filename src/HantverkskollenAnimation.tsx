import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  FileText,
  Phone,
} from "lucide-react";
import { getHanellGoogleMinDurationFrames, HanellGoogleVideo } from "./HanellGoogleVideo";

type CardProps = {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  price: string;
  driveFee: string;
  baseFee: string;
  imageUrl: string;
  uiScale: number;
  cardWidth: number;
  cardHeight: number;
  opacity?: number;
  buildProgress?: number;
  verified?: boolean;
};

const reveal = (progress: number, start: number, end: number) => {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
};

const HANTVERK_IMAGES = [
  "https://images.unsplash.com/photo-1595844730298-b960ff98fee0?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1561297331-a9c00b9c2c44?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1611021061285-16c871740efa?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1544164560-adac3045edb2?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1611021061218-761c355ed331?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1626081063434-79a2169791b1?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1687422810663-c316494f725a?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1590880795696-20c7dfadacde?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1667923006173-9e0d2251f608?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1611021061421-93741ec41ce1?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1595844730289-b248c919d6f9?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=160&h=160&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1553051021-9f94520a6cad?w=160&h=160&fit=crop&q=70&auto=format",
];

const HantverkskollenLogo: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 564.39 98.45"
      style={{ width, height, display: "block", flexShrink: 0 }}
      aria-label="Hantverkskollen logotyp"
    >
      <g fill="#334630">
        <path d="M21.62,8.5c6.24-4.24,13.06-6.86,20.47-7.97,3.28-.49,6.58-.64,9.89-.44,6.19.37,12.14,1.78,17.77,4.4,4.55,2.11,8.7,4.83,12.43,8.2,3.74,3.38,6.91,7.23,9.46,11.58,3.27,5.57,5.4,11.53,6.29,17.93.24,1.73.38,3.47.45,5.22.25,5.75-.53,11.35-2.28,16.82-2.07,6.47-5.36,12.27-9.84,17.39-3.96,4.53-8.6,8.21-13.9,11.05-4.88,2.6-10.05,4.32-15.52,5.18-3.32.52-6.67.71-10.02.53-4.07-.21-8.07-.89-11.97-2.08-6.79-2.08-12.85-5.47-18.16-10.16-4.65-4.11-8.4-8.92-11.24-14.45-2.4-4.69-4.04-9.62-4.82-14.82-.27-1.77-.37-3.57-.52-5.35-.08-.94-.12-1.89-.1-2.83.12-6.37,1.33-12.52,3.8-18.41,1.92-4.58,4.47-8.79,7.67-12.6,2.95-3.51,6.3-6.58,10.14-9.17M44.56,28.09c-5.9,0-11.81.03-17.71-.02-1.43-.01-2.62,1.12-2.61,2.57.02,2.43,0,4.87,0,7.3,0,.77.28,1.43.85,1.95.17.16.34.33.52.48,5,4.39,10,8.78,15.03,13.15.53.46.75.96.76,1.65,0,1.6.06,3.21.09,4.81.05,3.04.1,6.09.14,9.13.03,2.38.02,4.77.05,7.15,0,.71.05,1.42.12,2.12.06.64.38,1.17.9,1.55.9.66,1.86.71,2.86.21,3.1-1.56,6.2-3.13,9.32-4.65,1.27-.62,1.85-1.52,1.84-2.96-.04-5.81,0-11.62-.03-17.43,0-.65.2-1.1.69-1.52,3.88-3.3,7.75-6.63,11.62-9.95,1.43-1.23,2.86-2.46,4.29-3.7.67-.58.95-1.33.94-2.2v-4.75c0-.78.02-1.56,0-2.34-.03-1.01-.45-1.82-1.36-2.33-.46-.26-.95-.24-1.45-.24h-26.85v.02Z" />
        <path d="M142.83,59.15v-6.94c-.02-.8-.07-.87-.84-.87h-14.74c-.81,0-.86.06-.86.92v14.81c-.03.49-.12.57-.59.6-.28.02-.57.01-.85.01h-5.1c-.24,0-.48.02-.7-.04-.15-.04-.31-.21-.35-.36-.07-.22-.04-.47-.04-.7V30.45c0-1.06.01-1.07,1.06-1.07h5.67c.87,0,.92.05.92.93v13.46c0,1.37-.11,1.34,1.36,1.34h13.96c1.11,0,1.12,0,1.12-1.1v-13.46c0-1.16,0-1.17,1.18-1.17h5.45c1,0,1.02.02,1.02,1.05v35.99c0,1.38-.02,1.27-1.29,1.27h-5.24c-.19,0-.38,0-.57-.01-.44-.04-.51-.11-.54-.58-.02-.23,0-.47,0-.71v-7.23h-.02Z" />
        <path d="M176.59,66.39c-1.84,1.11-3.8,1.62-5.89,1.73-2.12.11-4.14-.21-6.07-1.05-2.57-1.12-4.55-2.93-6.02-5.3-1.66-2.68-2.41-5.61-2.46-8.75-.03-2.11.1-4.2.74-6.23.84-2.67,2.2-5,4.35-6.84,2.07-1.77,4.46-2.8,7.17-3.08,1.63-.17,3.25-.12,4.85.27,2.19.53,4.06,1.63,5.67,3.19.3.29.59.6.99,1,.04-.31.09-.51.09-.7,0-.85,0-1.7,0-2.55,0-.69.09-.77.79-.78h6.23c.69,0,.75.08.77.79v28.2c0,.28,0,.57,0,.85,0,.35-.19.51-.53.52-.14,0-.28.01-.42.01h-5.88c-.88,0-.93-.06-.94-.91v-2.41c0-.23-.02-.46-.04-.86-.61.61-1.08,1.15-1.62,1.62-.53.46-1.13.84-1.75,1.28M165.24,47.32c-1.54,2.8-1.69,5.72-.65,8.69.82,2.35,2.4,4.06,4.76,4.93,3.82,1.41,8.11-.37,9.8-4.11,1.21-2.68,1.24-5.49.21-8.22-1.46-3.84-5.19-5.78-9.28-4.88-2.09.46-3.65,1.7-4.85,3.58h0Z" />
        <path d="M360,56.58c3.23,3.65,6.47,7.23,9.75,10.96-.33.06-.5.13-.67.13-2.88,0-5.76,0-8.64.01-.5,0-.77-.27-1.04-.61-1.72-2.16-3.44-4.32-5.16-6.49-1.31-1.64-2.61-3.29-3.92-4.94-.19-.24-.39-.46-.61-.72-.28.23-.2.5-.2.74v10.84c0,.24,0,.47-.02.71-.01.28-.17.43-.45.45-.14,0-.28.02-.42.02h-5.88c-.82,0-.88-.06-.88-.9V28.24c0-.82.4-1.23,1.2-1.23h5.31c.21,0,.43,0,.64.02.31.02.48.17.49.49,0,.28.01.57.01.85v20.62c0,.3.02.59.03.89.05.02.1.03.15.05.15-.16.32-.31.46-.49,3-3.79,6.01-7.58,9-11.39.4-.51.82-.74,1.48-.74,2.67.03,5.34.01,8.01.02.25,0,.51.02.91.05-.19.29-.3.48-.44.65-3.06,3.5-6.13,6.99-9.2,10.48-1.03,1.17-2.06,2.34-3.08,3.51-.14.16-.24.34-.41.58,1.19,1.34,2.37,2.66,3.57,4.01v-.03Z" />
        <path d="M403.9,56.32v-27.92c0-.31,0-.61.02-.92,0-.28.17-.43.44-.45.16-.02.33-.02.5-.02h5.74c.9,0,.96.06.96.98v20.9c0,.32.02.64.03.95l.15.04c.15-.17.31-.33.45-.51,3.02-3.81,6.05-7.61,9.06-11.44.36-.46.74-.65,1.31-.64,2.74.02,5.48,0,8.22.01.23,0,.46.03.84.05-.23.3-.37.5-.53.69-4.04,4.62-8.09,9.23-12.14,13.85-.54.61-.54.66.02,1.29,4,4.49,8.01,8.99,12.01,13.49.24.27.48.55.82.95-.4.03-.62.06-.85.06-2.74,0-5.48-.02-8.22.02-.62,0-1-.22-1.37-.69-3.03-3.83-6.08-7.65-9.13-11.47-.15-.19-.33-.37-.49-.56-.05.02-.1.04-.15.05-.01.27-.03.54-.03.82v10.7q0,1.13-1.15,1.13h-5.89c-.52-.04-.59-.1-.62-.65-.01-.24,0-.47,0-.71v-9.99h0Z" />
        <path d="M304.19,59.47c.14-.19.29-.33.36-.5.29-.74.85-.86,1.58-.85,2.03.04,4.06.01,6.09.02.3,0,.59.05.98.08-.1.37-.14.68-.25.95-2.02,4.84-5.6,7.8-10.76,8.74-3.18.58-6.31.3-9.32-.92-4.61-1.88-7.38-5.36-8.53-10.15-.73-3.03-.72-6.1.08-9.12,1.56-5.89,5.36-9.46,11.34-10.64,2.77-.55,5.55-.44,8.27.38,4.16,1.25,7.14,3.85,8.84,7.87,1.15,2.71,1.41,5.56,1.12,8.47-.09.9-.15.93-1.06.93h-20.26c-.28,0-.56.03-.91.06-.01.27-.06.5-.03.72.71,4.76,4.55,6.66,8.16,6.24,1.73-.2,3.16-.9,4.3-2.28M303.79,49.63h1.56c.68-.01.81-.15.74-.79-.14-1.2-.58-2.28-1.35-3.22-2.35-2.84-6.42-3.05-8.93-1.92-2.1.94-3.34,2.62-3.89,4.84-.26,1.05-.23,1.1.83,1.1h11.05,0Z" />
        <path d="M508.13,38.07c1.8-.79,3.65-1.16,5.54-1.27,2.85-.17,5.6.24,8.2,1.48,3.79,1.82,6.16,4.82,7.29,8.83.63,2.23.78,4.51.5,6.81-.09.77-.15.82-.94.82h-20.12c-1.34,0-1.38.03-1.08,1.37.55,2.43,1.88,4.28,4.26,5.19,2.07.79,4.16.76,6.18-.23,1.02-.5,1.8-1.3,2.37-2.27.29-.5.65-.66,1.2-.65,2.15.02,4.3,0,6.45.01.27,0,.55.05.91.08-.09.35-.13.63-.23.88-1.64,4.06-4.5,6.86-8.67,8.27-1.39.47-2.83.68-4.31.75-2.37.1-4.67-.17-6.87-1.03-4.41-1.73-7.29-4.9-8.57-9.44-1.2-4.25-1.02-8.47.75-12.54,1.42-3.26,3.82-5.58,7.11-7.04M514.55,43.06c-.14.01-.28.04-.42.04-1.95.05-3.57.8-4.88,2.24-.95,1.04-1.48,2.29-1.75,3.66-.09.49,0,.59.49.63h12.96c.78,0,.91-.18.8-.93-.34-2.36-1.7-3.93-3.79-4.95-1.04-.51-2.17-.64-3.43-.69h.02Z" />
        <path d="M462.1,42.51c2.74,3.6,3.55,7.64,3.1,12.01-.32,3.09-1.44,5.85-3.45,8.23-2.43,2.9-5.58,4.53-9.26,5.15-2.88.49-5.74.33-8.52-.64-4.57-1.59-7.63-4.72-9.1-9.31-1.17-3.64-1.17-7.35.03-11,1.4-4.23,4.18-7.27,8.32-8.91,5.02-1.99,9.98-1.74,14.75.89,1.61.89,2.96,2.1,4.13,3.58M457.01,49.11c-.47-1.55-1.27-2.87-2.53-3.93-3.62-3.03-9.96-2.16-11.93,3.05-1.09,2.88-1.02,5.84.08,8.72.74,1.95,2.15,3.35,4.12,4.03,4.21,1.46,8.82-.45,10.22-5.19.64-2.18.55-4.38.04-6.7v.02Z" />
        <path d="M221.09,67.68h-3.19c-.82,0-1.23-.42-1.23-1.26,0-4.94,0-9.87,0-14.81,0-1.01-.1-2.03-.27-3.02-.55-3.17-3.03-5.12-6-5.2-1.49-.04-2.93.1-4.23.88-1.89,1.13-2.79,2.89-3.04,5.01-.09.79-.13,1.6-.13,2.4,0,4.94,0,9.87,0,14.81,0,.79-.41,1.19-1.22,1.19h-5.38c-.21,0-.44.03-.63-.04-.15-.05-.32-.21-.37-.35-.07-.22-.05-.47-.05-.7v-28.55c.03-.62.1-.71.7-.72,2.08-.01,4.16-.01,6.23,0,.61,0,.69.09.71.7.02.66,0,1.32,0,1.98,0,.22.03.45.06.8.24-.17.37-.24.48-.35,2.07-2.2,4.64-3.34,7.63-3.58,1.86-.14,3.69,0,5.44.63,3.84,1.36,6.19,4.1,7.22,8.01.37,1.42.51,2.89.52,4.35.02,5.57,0,11.15,0,16.72v.21c-.02.83-.06.87-.9.88h-2.35Z" />
        <path d="M537.15,67.68h-1.06c-.56-.03-.63-.1-.66-.68-.01-.19,0-.38,0-.57v-27.85c0-1.33-.04-1.26,1.3-1.26h5.67c.57.03.66.11.68.67.02.64,0,1.28.01,1.91,0,.25.02.51.04.9.24-.17.4-.25.51-.37,2.08-2.19,4.65-3.33,7.65-3.54,2.35-.16,4.62.15,6.75,1.2,2.96,1.47,4.83,3.87,5.74,7.02.43,1.48.61,3.01.61,4.55v16.87q0,1.16-1.19,1.16h-5.31q-1.15,0-1.15-1.13v-15.31c0-1.09-.08-2.17-.37-3.23-.74-2.75-2.9-4.48-5.75-4.62-1.19-.06-2.36,0-3.48.45-2.25.9-3.45,2.64-3.85,4.96-.13.76-.19,1.55-.19,2.32-.02,5.13,0,10.25,0,15.38,0,.78-.39,1.17-1.18,1.17h-4.77Z" />
        <path d="M390.15,59.49c.09-1.48-.28-2.23-1.64-2.78-1.51-.61-3.06-1.11-4.63-1.55-1.93-.55-3.89-.99-5.74-1.78-1.48-.63-2.74-1.57-3.74-2.83-.88-1.11-1.25-2.43-1.35-3.82-.25-3.72,1.4-6.41,4.56-8.23,2.05-1.18,4.31-1.63,6.65-1.72,1.78-.06,3.54.07,5.26.56,2.83.8,5.05,2.39,6.51,4.98.66,1.17.99,2.45,1.17,3.77.07.53-.07.7-.61.7-2.01.01-4.01,0-6.02,0-.38,0-.62-.12-.71-.52-.5-2.06-1.93-3.05-3.93-3.34-1.18-.17-2.36-.11-3.5.28-1.33.45-1.96,1.38-1.91,2.72.04,1.04.6,1.75,1.48,2.15.94.43,1.92.8,2.91,1.1,1.98.61,4,1.13,5.98,1.75,1.43.44,2.74,1.12,3.92,2.07,3.34,2.69,3.34,7.55,1.53,10.35-1.06,1.65-2.54,2.77-4.29,3.57-1.43.65-2.95.99-4.51,1.15-2.35.23-4.67.09-6.93-.61-2.51-.78-4.7-2.08-6.33-4.2-1-1.3-1.65-2.75-1.88-4.37-.1-.69,0-.84.66-.84,2.1-.01,4.2,0,6.31,0,.39,0,.65.1.78.54.68,2.27,2.41,3.23,4.59,3.51,1.13.14,2.27.06,3.35-.37,1.02-.4,1.79-1.04,2.07-2.22v-.02Z" />
        <path d="M274.94,54.9c-1.39,3.75-2.76,7.45-4.13,11.14-.12.33-.28.65-.37,1-.13.51-.45.65-.94.64-2.08-.02-4.16,0-6.24,0h-1.49c-.87,0-.88,0-1.18-.8-.58-1.55-1.15-3.1-1.72-4.65-2.28-6.18-4.55-12.36-6.83-18.54-.68-1.84-1.36-3.68-2.03-5.52-.08-.22-.13-.44-.23-.76.29-.04.51-.09.73-.09h6.66c.72,0,.74.03.99.76.92,2.76,1.82,5.51,2.73,8.27,1.35,4.1,2.71,8.21,4.06,12.31.18.53.35,1.07.55,1.67.38-.27.4-.62.49-.91,1.05-3.18,2.1-6.37,3.14-9.56,1.27-3.86,2.54-7.72,3.81-11.57.32-.98.33-.98,1.32-.98h6.02c.3,0,.6.04,1.01.07-.09.36-.14.65-.24.92-.96,2.62-1.93,5.23-2.89,7.84-1.07,2.9-2.15,5.8-3.24,8.75h.02Z" />
        <path d="M247.33,40.3v2.41c0,.75-.07.82-.81.82-1.61.01-3.21,0-4.82,0-.78,0-1.17.4-1.17,1.19v13.04c0,.45.04.9.1,1.34.17,1.13.72,1.73,1.85,1.95.64.13,1.31.17,1.97.19.73.03,1.46,0,2.2.02.58.02.67.09.67.66,0,1.7,0,3.4,0,5.1,0,.53-.1.64-.63.63-2.15-.01-4.3.13-6.44-.15-1.11-.15-2.18-.43-3.18-.93-1.98-.99-3.19-2.6-3.78-4.71-.33-1.17-.46-2.36-.46-3.57v-13.39c0-1.51.02-1.36-1.41-1.37-.52,0-1.04.01-1.56,0-.54-.02-.66-.13-.67-.69,0-1.61,0-3.21,0-4.82,0-.62.1-.7.7-.72.64-.02,1.28,0,1.91,0,.99,0,1.02-.03,1.02-1.06v-5.74c.02-.73.08-.8.83-.81h6.02c.77,0,.84.07.84.87v6.03c.03.6.12.7.72.71,1.56.01,3.12,0,4.68,0s1.4-.1,1.4,1.44v1.56h.02Z" />
        <path d="M493.94,61.28v5.6c-.02.73-.08.78-.83.8h-5.88c-.14,0-.28,0-.42-.01-.44-.05-.5-.11-.55-.58-.01-.16-.01-.33-.01-.5V28.06c0-1.04.02-1.06,1.08-1.06h5.52c.21,0,.43,0,.64.02.27.03.43.19.43.47,0,.31.02.61.02.92v32.87h0Z" />
        <path d="M478.64,35.62v30.74c0,1.39.07,1.31-1.31,1.32h-5.17c-.21,0-.42,0-.64-.01-.35,0-.51-.19-.52-.53,0-.21-.01-.42-.01-.64V28.19c0-.79.39-1.18,1.18-1.18h5.38c.21,0,.43,0,.64.02.27.02.43.18.44.46,0,.24.02.47.02.71v7.44-.02Z" />
        <path d="M336.72,41.58v2.05c0,1.22,0,1.19-1.2,1.24-1.13.05-2.26.12-3.38.3-1.39.23-2.59.87-3.46,2.03-.55.73-.89,1.57-1.02,2.46-.15,1.02-.28,2.06-.29,3.09-.03,4.58-.01,9.16-.01,13.74,0,.79-.39,1.18-1.17,1.18h-5.38c-.24,0-.48.02-.7-.04-.15-.04-.31-.21-.36-.35-.07-.22-.04-.47-.04-.7v-28.19c0-1.07,0-1.08,1.05-1.08h5.74c.79,0,.85.07.86.85.01.92,0,1.84,0,2.76,0,.23.02.46.05.85.23-.26.37-.4.49-.56,2.05-2.7,4.73-4.2,8.14-4.35.57-.03.67.03.67.61.01,1.35,0,2.69,0,4.11h.01Z" />
        <path d="M46.36,55.72c0-.87,0-1.67,0-2.48,0-.93-.36-1.67-1.06-2.29-5.15-4.51-10.29-9.03-15.44-13.53-.4-.35-.57-.71-.55-1.22.03-.73,0-1.46,0-2.2,0-.91.04-.93.98-.94h37.54c1.42,0,1.34-.08,1.34,1.36,0,.59-.03,1.18,0,1.77.03.53-.18.89-.57,1.22-1.69,1.44-3.37,2.89-5.05,4.33-3.53,3.03-7.06,6.06-10.6,9.07-.85.72-1.25,1.56-1.24,2.71.04,5.55.02,11.1.02,16.65,0,.26,0,.52,0,.78,0,.32-.12.55-.4.69-1.43.72-2.87,1.44-4.31,2.15-.05.03-.14,0-.29,0-.03-.26-.09-.53-.09-.8-.02-1.18-.03-2.36-.04-3.54-.03-2.48-.07-4.96-.1-7.43-.02-1.7-.03-3.4-.05-5.1,0-.38-.06-.75-.09-1.2h0Z" />
      </g>
    </svg>
  );
};

/** Design height for `NavbarMock` (px before `uiScale`); även start-offset för lista under baren i `StaticScene`. */
const NAVBAR_BAR_HEIGHT_DESIGN_PX = 104;
/** Same factor as `IntroCompanyJoinScene` (`width / 900`) so the navbar matches the first scene everywhere. */
const NAVBAR_UI_SCALE_DIVISOR = 900;

const NavbarMock: React.FC<{ uiScale: number }> = ({ uiScale }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: NAVBAR_BAR_HEIGHT_DESIGN_PX * uiScale,
        display: "flex",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(30px) saturate(200%)",
        WebkitBackdropFilter: "blur(30px) saturate(200%)",
        borderBottom: "0.5px solid rgba(0, 0, 0, 0.08)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1920 * uiScale,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 54 * uiScale,
          paddingRight: 54 * uiScale,
          gap: 8 * uiScale,
        }}
      >
        <HantverkskollenLogo width={210 * uiScale} height={60 * uiScale} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 * uiScale }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 46 * uiScale,
              borderRadius: 14 * uiScale,
              paddingLeft: 16 * uiScale,
              paddingRight: 16 * uiScale,
              fontSize: 13 * uiScale,
              fontWeight: 700,
              color: "#ffffff",
              backgroundColor: "#FF7A4A",
              gap: 8 * uiScale,
            }}
          >
            <FileText size={15 * uiScale} color="#ffffff" strokeWidth={2.2} />
            Fler offerter
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46 * uiScale,
              height: 46 * uiScale,
              color: "#334630",
            }}
          >
            <Menu size={25 * uiScale} strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({
  x,
  y,
  title,
  subtitle,
  price,
  driveFee,
  baseFee,
  imageUrl,
  uiScale,
  cardWidth,
  cardHeight,
  opacity = 1,
  verified = false,
  buildProgress = 1,
}) => {
  const imageOp = reveal(buildProgress, 0.05, 0.2);
  const titleOp = reveal(buildProgress, 0.18, 0.32);
  const subtitleOp = reveal(buildProgress, 0.28, 0.42);
  const ratingOp = reveal(buildProgress, 0.38, 0.52);
  const buttonsOp = reveal(buildProgress, 0.5, 0.65);
  const rightPanelOp = reveal(buildProgress, 0.55, 0.7);
  const priceLabelOp = reveal(buildProgress, 0.65, 0.78);
  const priceValueOp = reveal(buildProgress, 0.75, 0.88);
  const feesOp = reveal(buildProgress, 0.85, 1);
  const verifiedBorderProgress = verified ? reveal(buildProgress, 0.9, 1) : 0;
  const verifiedStickerProgress = verified ? reveal(buildProgress, 0.94, 1) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: cardWidth,
        height: cardHeight,
        transform: "translate(-50%, -50%)",
        borderRadius: 12 * uiScale,
        backgroundColor: "#ffffff",
        border: `${(verified ? 1 + 1.2 * verifiedBorderProgress : 1) * uiScale}px solid ${
          verified ? `rgba(212, 175, 55, ${verifiedBorderProgress})` : "#d4d8dc"
        }`,
        boxShadow: verified
          ? `0 6px 16px rgba(15, 23, 42, ${0.06 + 0.1 * verifiedBorderProgress}), 0 0 0 ${
              (1 + 2 * verifiedBorderProgress) * uiScale
            }px rgba(212, 175, 55, ${0.5 * verifiedBorderProgress}), 0 0 ${
              (10 + 24 * verifiedBorderProgress) * uiScale
            }px rgba(212, 175, 55, ${0.62 * verifiedBorderProgress})`
          : "0 2px 8px rgba(15, 23, 42, 0.06)",
        display: "flex",
        overflow: "visible",
        opacity,
      }}
    >
      <div
        style={{
          flex: 1,
          padding: `${14 * uiScale}px ${16 * uiScale}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 * uiScale }}>
          <div style={{ position: "relative", width: 56 * uiScale, height: 56 * uiScale, flexShrink: 0, opacity: imageOp }}>
            <Img
              src={imageUrl}
              style={{
                width: 56 * uiScale,
                height: 56 * uiScale,
                borderRadius: 8 * uiScale,
                border: `${1 * uiScale}px solid #d1d5db`,
                objectFit: "cover",
                display: "block",
                flexShrink: 0,
              }}
            />
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ opacity: titleOp }}>
              <div style={{ fontSize: 18 * uiScale, fontWeight: 700, color: "#1f2937", lineHeight: 1.15 }}>{title}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4 * uiScale,
                fontSize: 13 * uiScale,
                color: "#4b5563",
                marginTop: 4 * uiScale,
                opacity: subtitleOp,
              }}
            >
              <MapPin size={13 * uiScale} color="#4b5563" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {subtitle}
            </div>
            <div style={{ fontSize: 14 * uiScale, color: "#4a6b47", marginTop: 4 * uiScale, letterSpacing: 1, opacity: ratingOp }}>
              ★★★★★ <span style={{ color: "#4b5563", marginLeft: 4 * uiScale }}>5.0</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 * uiScale, opacity: buttonsOp }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6 * uiScale,
              background: "linear-gradient(90deg, #334630 0%, #4a6b47 100%)",
              color: "#ffffff",
              borderRadius: 999,
              padding: `${7 * uiScale}px ${14 * uiScale}px`,
              fontSize: 12 * uiScale,
              fontWeight: 700,
              boxShadow: `0 1px 2px rgba(15,23,42,0.15), inset 0 0 0 ${2 * uiScale}px rgba(255,255,255,0.18)`,
            }}
          >
            <Mail size={12 * uiScale} color="#ffffff" strokeWidth={2.2} style={{ flexShrink: 0 }} />
            Skicka meddelande
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6 * uiScale,
              border: `${1 * uiScale}px solid #9ca3af`,
              color: "#374151",
              borderRadius: 999,
              padding: `${7 * uiScale}px ${14 * uiScale}px`,
              fontSize: 12 * uiScale,
              fontWeight: 600,
              background: "#ffffff",
            }}
          >
            <Phone size={12 * uiScale} color="#374151" strokeWidth={2.2} style={{ flexShrink: 0 }} />
            Visa telefonnummer
          </div>
        </div>
      </div>
      <div
        style={{
          width: 200 * uiScale,
          borderLeft: `${1 * uiScale}px solid #d1d5db`,
          background: "#f3f4f6",
          padding: `${16 * uiScale}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: rightPanelOp,
        }}
      >
        <div>
          <div style={{ fontSize: 12 * uiScale, color: "#4b5563", marginBottom: 6 * uiScale, opacity: priceLabelOp }}>Timpris:</div>
          <div style={{ fontSize: 24 * uiScale, fontWeight: 700, color: "#1f2937", lineHeight: 1, opacity: priceValueOp }}>{price} kr</div>
        </div>
        <div style={{ fontSize: 11 * uiScale, color: "#6b7280", lineHeight: 1.4, opacity: feesOp }}>
          <div>Framkörning {driveFee}</div>
          <div>Grundavgift {baseFee}</div>
        </div>
      </div>
      {verifiedStickerProgress > 0 ? (
        <Img
          src={staticFile("hk-verified.png")}
          style={{
            position: "absolute",
            right: -20 * uiScale,
            top: -7 * uiScale,
            width: 66 * uiScale,
            height: 66 * uiScale,
            objectFit: "contain",
            zIndex: 8,
            opacity: verifiedStickerProgress,
            transform: `scale(${0.92 + 0.08 * verifiedStickerProgress})`,
          }}
        />
      ) : null}
    </div>
  );
};

const COMPANIES: { title: string; subtitle: string; price: string }[] = [
  { title: "Nordhamn Bygg AB", subtitle: "Sveavägen 112, 113 50 Stockholm", price: "395" },
  { title: "Takfönsterspecialisten Sverige AB", subtitle: "Hantverkargatan 44, 112 21 Stockholm", price: "845" },
  { title: "Sund Byggservice", subtitle: "Drottninggatan 14, 111 51 Stockholm", price: "515" },
  { title: "NordVest Snickeri AB", subtitle: "Norrtullsgatan 22, 113 45 Stockholm", price: "735" },
  { title: "Bygg & Renovering Skåne", subtitle: "Sankt Eriksgatan 5, 112 39 Stockholm", price: "460" },
  { title: "Stockholms Hantverk", subtitle: "Kungsgatan 18, 111 43 Stockholm", price: "680" },
  { title: "Snickeri Pålsson AB", subtitle: "Birkagatan 33, 113 39 Stockholm", price: "575" },
  { title: "Skånska Byggteamet", subtitle: "Odengatan 12, 114 24 Stockholm", price: "910" },
  { title: "BoBygg Stockholm", subtitle: "Tegnérgatan 7, 111 40 Stockholm", price: "425" },
  { title: "Limhamn Snickeri", subtitle: "Strandvägen 41, 114 56 Stockholm", price: "790" },
  { title: "Olssons Bygg & Snickeri", subtitle: "Västmannagatan 24, 113 25 Stockholm", price: "640" },
  { title: "Hantverkare Direkt AB", subtitle: "Scheelegatan 16, 112 23 Stockholm", price: "485" },
  { title: "MD Bygg Stockholm", subtitle: "Hornsgatan 9, 118 20 Stockholm", price: "705" },
  { title: "Centrum Bygg Skåne", subtitle: "Järnvägsgatan 3, 111 20 Stockholm", price: "555" },
  { title: "Elite Snickeri AB", subtitle: "Karlbergsvägen 14, 113 27 Stockholm", price: "980" },
  { title: "Råå Byggteknik", subtitle: "Rörstrandsgatan 18, 113 40 Stockholm", price: "440" },
  { title: "Pålsjö Hantverk", subtitle: "Sibyllegatan 6, 114 42 Stockholm", price: "760" },
  { title: "Söderpunkten Bygg", subtitle: "Folkungagatan 15, 116 36 Stockholm", price: "525" },
  { title: "Drottninghög Snickeri", subtitle: "Vasagatan 27, 111 20 Stockholm", price: "695" },
  { title: "Maria Park Hantverk", subtitle: "Mariatorget 4, 118 48 Stockholm", price: "610" },
];

const FORM_TYPING_CHARS_PER_FRAME = 0.74;
const FORM_TYPING_START_FRAME = 10;
const FORM_PAUSE_BETWEEN_FIELDS_SECONDS = 0.15;
const FORM_DELAY_BEFORE_MOVE_SECONDS = 0.25;
const FORM_CURSOR_MOVE_SECONDS = 0.3;
const FORM_DELAY_AFTER_ARRIVAL_SECONDS = 0.25;
const FORM_EXTRA_AFTER_PULSE_SECONDS = 0.03;
const FORM_NAME = "Anderssons Måleri AB";
const FORM_ORG = "559123-4567";
const FORM_CONTACT = "Anna Andersson";

const getFormSubmitClickFrame = (fps: number) => {
  const pauseBetweenFields = Math.round(fps * FORM_PAUSE_BETWEEN_FIELDS_SECONDS);
  const nameTypingFrames = Math.ceil(FORM_NAME.length / FORM_TYPING_CHARS_PER_FRAME);
  const orgTypingFrames = Math.ceil(FORM_ORG.length / FORM_TYPING_CHARS_PER_FRAME);
  const contactTypingFrames = Math.ceil(FORM_CONTACT.length / FORM_TYPING_CHARS_PER_FRAME);
  const typingDoneFrame =
    FORM_TYPING_START_FRAME +
    nameTypingFrames +
    pauseBetweenFields +
    orgTypingFrames +
    pauseBetweenFields +
    contactTypingFrames;
  const moveStartDelay = Math.round(fps * FORM_DELAY_BEFORE_MOVE_SECONDS);
  const moveDuration = Math.round(fps * FORM_CURSOR_MOVE_SECONDS);
  const afterArrivalDelay = Math.round(fps * FORM_DELAY_AFTER_ARRIVAL_SECONDS);
  const afterPulseDelay = Math.round(fps * FORM_EXTRA_AFTER_PULSE_SECONDS);
  return typingDoneFrame + moveStartDelay + moveDuration + afterArrivalDelay + afterPulseDelay;
};

/** Total längd för `HantverkskollenSearchJourney` (intro + split) vid given fps — håll i synk med `Root`. */
export function getHantverkskollenSearchJourneyDurationInFrames(fps: number): number {
  return getFormSubmitClickFrame(fps) + getHanellGoogleMinDurationFrames(fps, 2);
}

const IntroCompanyJoinScene: React.FC<{
  layoutWidth?: number;
  layoutHeight?: number;
  /** In split view: show filled form + clicked button without replaying typing. */
  freezeComplete?: boolean;
}> = ({ layoutWidth, layoutHeight, freezeComplete }) => {
  const timelineFrame = useCurrentFrame();
  const frame = freezeComplete ? 10_000 : timelineFrame;
  const { width: cw, height: ch, fps } = useVideoConfig();
  const width = layoutWidth ?? cw;
  const height = layoutHeight ?? ch;
  const k = width / NAVBAR_UI_SCALE_DIVISOR;
  /** Tall canvas (t.ex. 2520×2831): smalare kort centrerat; bred 16∶9: som tidigare. */
  const tallAspect = height / width >= 1.02;
  const formWidth = tallAspect ? Math.min(width, 1450) : width;
  const formPaddingX = tallAspect ? 20 * k : 22 * k;
  const formPaddingY = tallAspect ? 16 * k : 18 * k;
  /** Innehållshöjd (ungefär) för vertikal centrering — utan enorm tom yta. */
  const contentStackH =
    26 * k +
    14 * k +
    25 * k +
    6 * k +
    13 * k +
    18 * k +
    1 * k +
    16 * k +
    8 * k +
    18 * k +
    (17 + 6 + 48) * k +
    14 * k +
    (17 + 6 + 48) * k +
    14 * k +
    (17 + 6 + 48) * k +
    20 * k +
    44 * k;
  const formOuterH = contentStackH + formPaddingY * 2;
  const formLeft = (width - formWidth) / 2;
  const formTop = (height - formOuterH) / 2;
  const buttonWidth = tallAspect ? 160 * k : 144 * k;
  const buttonHeight = tallAspect ? 46 * k : 44 * k;
  const nextButtonLeft = formLeft + formWidth - formPaddingX - buttonWidth;
  const nextButtonTop = formTop + formOuterH - formPaddingY - buttonHeight;
  const nextButtonCenterX = nextButtonLeft + buttonWidth * 0.5;
  const nextButtonCenterY = nextButtonTop + buttonHeight * 0.5;
  const nameFieldLeft = formLeft + formPaddingX + 16 * k;
  const fullQuery = FORM_NAME;
  const fullOrgNumber = FORM_ORG;
  const fullContactName = FORM_CONTACT;
  const startTypingFrame = FORM_TYPING_START_FRAME;
  const charsPerFrame = FORM_TYPING_CHARS_PER_FRAME;
  const pauseBetweenFields = Math.round(fps * FORM_PAUSE_BETWEEN_FIELDS_SECONDS);

  const nameTypingFrames = Math.ceil(fullQuery.length / charsPerFrame);
  const orgTypingStartFrame = startTypingFrame + nameTypingFrames + pauseBetweenFields;
  const orgTypingFrames = Math.ceil(fullOrgNumber.length / charsPerFrame);
  const contactTypingStartFrame = orgTypingStartFrame + orgTypingFrames + pauseBetweenFields;

  const typedNameChars = Math.max(0, Math.floor((frame - startTypingFrame) * charsPerFrame));
  const typedQuery = fullQuery.slice(0, Math.min(fullQuery.length, typedNameChars));
  const typedOrgChars = Math.max(0, Math.floor((frame - orgTypingStartFrame) * charsPerFrame));
  const typedOrgNumber = fullOrgNumber.slice(0, Math.min(fullOrgNumber.length, typedOrgChars));
  const typedContactChars = Math.max(0, Math.floor((frame - contactTypingStartFrame) * charsPerFrame));
  const typedContactName = fullContactName.slice(0, Math.min(fullContactName.length, typedContactChars));
  const completedFields =
    (typedQuery.length >= fullQuery.length ? 1 : 0) +
    (typedOrgNumber.length >= fullOrgNumber.length ? 1 : 0) +
    (typedContactName.length >= fullContactName.length ? 1 : 0);
  const formProgress = completedFields / 3;
  const typingDoneFrame = contactTypingStartFrame + Math.ceil(fullContactName.length / charsPerFrame);
  const isFormComplete = completedFields === 3;
  const moveToButtonStartFrame = typingDoneFrame + Math.round(fps * FORM_DELAY_BEFORE_MOVE_SECONDS);
  const cursorArrivalFrame = moveToButtonStartFrame + Math.round(fps * FORM_CURSOR_MOVE_SECONDS);
  const cursorX = interpolate(
    frame,
    [0, moveToButtonStartFrame, cursorArrivalFrame],
    [nameFieldLeft + 12 * k, nameFieldLeft + 12 * k, nextButtonCenterX - 12 * k],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const cursorY = interpolate(
    frame,
    [0, moveToButtonStartFrame, cursorArrivalFrame],
    [formTop + formOuterH + 28 * k, formTop + formOuterH + 28 * k, nextButtonCenterY - 10 * k],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pulseFrames = Math.max(1, Math.round(fps * 0.05));
  const pulseHoldFrames = Math.max(1, Math.round(fps * 0.2));
  const pulseHalfFrames = Math.max(1, Math.floor(pulseFrames / 2));
  const buttonQuickPulse = interpolate(
    frame,
    [
      cursorArrivalFrame - pulseFrames - pulseHalfFrames,
      cursorArrivalFrame - pulseFrames,
      cursorArrivalFrame - pulseFrames + pulseHoldFrames,
      cursorArrivalFrame - pulseFrames + pulseHoldFrames + pulseHalfFrames,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const buttonScaleBoost = buttonQuickPulse * 0.04;
  const buttonBgColor = isFormComplete ? "#FF7A4A" : "#efb19f";

  return (
    <AbsoluteFill
      style={{
        background: "#bcccb5",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <NavbarMock uiScale={k} />
      <div
        style={{
          position: "absolute",
          left: formLeft,
          top: formTop,
          width: formWidth,
          borderRadius: tallAspect ? 18 * k : 22 * k,
          background: "#dde2dc",
          border: `${1 * k}px solid #9fb09a`,
          boxShadow:
            tallAspect
              ? "0 4px 24px rgba(44, 69, 47, 0.12), 0 2px 0 rgba(255,255,255,0.45) inset"
              : "0 2px 0 rgba(255,255,255,0.4) inset",
          padding: `${formPaddingY}px ${formPaddingX}px`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8 * k,
            background: "#e7ece6",
            border: `${1 * k}px solid #c8d1c6`,
            borderRadius: 999,
            padding: `${4 * k}px ${10 * k}px`,
            color: "#1f2937",
            fontSize: 11 * k,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 14 * k,
              height: 14 * k,
              borderRadius: "50%",
              border: `${1.5 * k}px solid #e29c80`,
              display: "inline-block",
              boxSizing: "border-box",
            }}
          />
          Verifieringsformulär
        </div>
        <div
          style={{
            fontSize: (tallAspect ? 22 : 25) * k,
            fontWeight: 800,
            color: "#2c452f",
            marginTop: 12 * k,
            letterSpacing: tallAspect ? -0.3 : 0,
          }}
        >
          Företagsuppgifter
        </div>
        <div style={{ fontSize: (tallAspect ? 12.5 : 13) * k, color: "#1f2937", marginTop: 5 * k, lineHeight: 1.35 }}>
          Fyll i uppgifterna nedan för att gå vidare.
        </div>

        <div
          style={{
            height: 1 * k,
            background: "#c5cec2",
            marginTop: tallAspect ? 14 * k : 18 * k,
            marginLeft: -formPaddingX,
            marginRight: -formPaddingX,
          }}
        />

        <div
          style={{
            marginTop: 16 * k,
            height: 8 * k,
            borderRadius: 999,
            background: "#d2dbcf",
          }}
        >
          <div
            style={{
              width: `${formProgress * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: "#f97316",
              transition: "width 220ms ease-out",
            }}
          />
        </div>

        <div style={{ marginTop: tallAspect ? 14 * k : 18 * k }}>
          <div style={{ fontSize: (tallAspect ? 15.5 : 17) * k, color: "#334630", marginBottom: 5 * k, fontWeight: 600 }}>
            Företagsnamn *
          </div>
          <div
            style={{
              height: (tallAspect ? 44 : 48) * k,
              borderRadius: 12 * k,
              border: `${1.5 * k}px solid #b7c4b3`,
              background: "#f3f3f3",
              display: "flex",
              alignItems: "center",
              paddingLeft: 16 * k,
              fontSize: (tallAspect ? 16 : 18) * k,
              color: "#111111",
            }}
          >
            {typedQuery}
          </div>
        </div>

        <div style={{ marginTop: tallAspect ? 12 * k : 14 * k }}>
          <div style={{ fontSize: (tallAspect ? 15.5 : 17) * k, color: "#334630", marginBottom: 5 * k, fontWeight: 600 }}>
            Organisationsnummer *
          </div>
          <div
            style={{
              height: (tallAspect ? 44 : 48) * k,
              borderRadius: 12 * k,
              border: `${1.5 * k}px solid #b7c4b3`,
              background: "#f3f3f3",
              display: "flex",
              alignItems: "center",
              paddingLeft: 16 * k,
              fontSize: (tallAspect ? 16 : 18) * k,
              color: "#111111",
            }}
          >
            {typedOrgNumber}
          </div>
        </div>

        <div style={{ marginTop: tallAspect ? 12 * k : 14 * k }}>
          <div style={{ fontSize: (tallAspect ? 15.5 : 17) * k, color: "#334630", marginBottom: 5 * k, fontWeight: 600 }}>
            Kontaktperson *
          </div>
          <div
            style={{
              height: (tallAspect ? 44 : 48) * k,
              borderRadius: 12 * k,
              border: `${1.5 * k}px solid #b7c4b3`,
              background: "#f3f3f3",
              display: "flex",
              alignItems: "center",
              paddingLeft: 16 * k,
              fontSize: (tallAspect ? 16 : 18) * k,
              color: "#111111",
            }}
          >
            {typedContactName}
          </div>
        </div>

        <div
          style={{
            marginTop: tallAspect ? 16 * k : 20 * k,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: buttonWidth,
              height: buttonHeight,
              borderRadius: 12 * k,
              background: buttonBgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: (tallAspect ? 16 : 18) * k,
              fontWeight: 700,
              transform: `scale(${1 + buttonScaleBoost})`,
              boxShadow: "0 6px 14px rgba(201,120,92,0.24)",
            }}
          >
            Registrera
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          width: 28 * k,
          height: 38 * k,
          zIndex: 20,
          transform: "scale(1)",
          filter: "drop-shadow(0 3px 8px rgba(15,23,42,0.3))",
        }}
      >
        <svg viewBox="0 0 28 38" style={{ width: "100%", height: "100%" }}>
          <path
            d="M2 2 L24 18 L15 20 L19 34 L13 36 L10 22 L2 28 Z"
            fill="#111827"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: cursorX + 8 * k,
          top: cursorY + 18 * k,
          width: 0,
          height: 0,
          borderRadius: 999,
          border: "0 solid transparent",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 19,
        }}
      />
    </AbsoluteFill>
  );
};

const StaticScene: React.FC<{
  frameOffset?: number;
  startDelayFrames?: number;
  contentStartOffsetYPx?: number;
  compactContentLayer?: boolean;
  showNavbar?: boolean;
  layoutWidth?: number;
  layoutHeight?: number;
  /** Fixed timeline frame for still previews. Omit to play the full timeline. */
  lockedFrame?: number;
  /** When embedded in a shorter `Sequence`, pass its length so scroll/land timing fits the clip. */
  clipDurationInFrames?: number;
}> = ({
  frameOffset = 0,
  startDelayFrames = 0,
  contentStartOffsetYPx = 90,
  compactContentLayer = false,
  showNavbar = false,
  layoutWidth,
  layoutHeight,
  lockedFrame,
  clipDurationInFrames,
}) => {
  const sourceFrame = useCurrentFrame();
  const timelineFrame = lockedFrame ?? Math.max(0, sourceFrame - frameOffset - startDelayFrames);
  const frame = timelineFrame;
  const { width: cw, height: ch, durationInFrames, fps } = useVideoConfig();
  const width = layoutWidth ?? cw;
  const height = layoutHeight ?? ch;
  const timelineEnd =
    clipDurationInFrames ?? durationInFrames;
  /** Tall canvas (e.g. 2520×2831): redesign positioning so content fills the frame; wide 16∶9: keep original look. */
  const tallAspect = height / width >= 1.02;
  const k = width / 1280;
  const navbarUiScale = width / NAVBAR_UI_SCALE_DIVISOR;
  const resultsMargin = tallAspect ? 60 * k : 96 * k;
  const resultsX = resultsMargin;
  const resultsW = width - resultsMargin * 2;
  const listX = resultsX + resultsW / 2;
  const cardInset = tallAspect ? 18 * k : 12 * k;
  const cardWpx = resultsW - 2 * cardInset;
  /** Card aspect: 720∶146 on wide canvas, 720∶188 on tall canvas (compact listing rows). */
  const cardAspect = tallAspect ? 188 / 720 : 146 / 720;
  const cardHpx = cardWpx * cardAspect;
  const cardUiScale = cardWpx / 720;
  const rowGap = cardHpx + (tallAspect ? 22 : 14) * k;
  /** Toppmarginal sedan hjälte och sökfält saknas; undvik överdrag under `NavbarMock` när den visas. */
  const navbarInsetY = showNavbar ? NAVBAR_BAR_HEIGHT_DESIGN_PX * navbarUiScale : 0;
  /** Lägre värde = resultatruta högre upp i ramen. */
  const resultsY = (tallAspect ? 20 : 14) * k + navbarInsetY;
  /** Avstånd från resultatrutans topp till första kortets centrum (matchar rubrik + “Sortera” + vertikal padding). */
  const resultsHeaderH = tallAspect ? 146 * k : 112 * k;
  const resultsPanelMarginBottom = (tallAspect ? 20 : 16) * k;
  const firstY = resultsY + resultsHeaderH + resultsPanelMarginBottom + cardHpx / 2;
  const lastCardBottom = firstY + cardHpx / 2 + rowGap * COMPANIES.length;
  /** Space below the pagination bar so it isn’t flush with the scroll/content edge. */
  const paginationMarginBottom = (tallAspect ? 500 : 370) * k;
  const contentHeight = lastCardBottom + 60 * k + paginationMarginBottom;
  const movingLayerHeight = compactContentLayer ? height : contentHeight;
  const scrollDistance = Math.max(0, contentHeight - height);

  const introStillFrames = 12;
  const popFrames = 18;
  const liftFrames = 18;
  const buildFrames = Math.round(fps * 1.7);
  const holdBeforeLiftFrames = buildFrames + Math.round(fps * 0.15);
  const holdAtTopFrames = Math.round(fps * 0.25);
  const landDurationFrames = 12;
  const popEndFrame = introStillFrames + popFrames;
  const liftStartFrame = popEndFrame + holdBeforeLiftFrames;
  const liftEndFrame = liftStartFrame + liftFrames;
  const scrollStartFrame = liftEndFrame + holdAtTopFrames;

  const remainingFramesForScroll = timelineEnd - scrollStartFrame;
  const canAnimateScroll = remainingFramesForScroll > 1 && scrollDistance > 0;
  const targetScrollDuration = Math.round(fps * 1.6);
  const scrollDurationFrames = canAnimateScroll
    ? Math.max(1, Math.min(targetScrollDuration, remainingFramesForScroll - landDurationFrames))
    : 1;
  const scrollFinishFrame = scrollStartFrame + scrollDurationFrames;
  const landStartFrame = scrollFinishFrame;
  const landEndFrame = landStartFrame + landDurationFrames;

  const scrollFrame = Math.max(0, frame - scrollStartFrame);
  const scrollY = canAnimateScroll
    ? interpolate(scrollFrame, [0, scrollDurationFrames], [-scrollDistance, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : -scrollDistance;

  const insertAfterIndex = 18; // Between Drottninghög and Maria Park
  const mariaIndex = 19;
  const mariaShift = interpolate(
    frame,
    [introStillFrames, popEndFrame, landStartFrame, landEndFrame],
    [0, rowGap, rowGap, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    },
  );
  const landShift = interpolate(frame, [landStartFrame, landEndFrame], [0, rowGap], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const popIn = spring({
    frame: Math.max(0, frame - introStillFrames),
    fps,
    config: {
      damping: 200,
      stiffness: 170,
      mass: 0.8,
    },
    durationInFrames: popFrames,
  });
  const insertedMiddleY = firstY + rowGap * (insertAfterIndex + 1);
  const heldViewportY = insertedMiddleY - scrollDistance;
  const buildProgress = interpolate(frame, [popEndFrame, popEndFrame + buildFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.2, 1),
  });
  const fixedContainerY = heldViewportY - scrollY;
  const landProgress = interpolate(frame, [landStartFrame, landEndFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const insertedCardY = interpolate(landProgress, [0, 1], [fixedContainerY, firstY]);
  const insertedCardMarginTop = (tallAspect ? 20 : 16) * k;
  const insertedCardYWithMargin = insertedCardY + insertedCardMarginTop;
  const insertedPopScale = interpolate(popIn, [0, 1], [0.88, 1]);
  const insertedPromoteScale = interpolate(frame, [liftStartFrame, liftEndFrame], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const insertedAfterLiftScale = interpolate(
    frame,
    [liftEndFrame, scrollStartFrame, landStartFrame, landEndFrame],
    [1.08, 1.08, 1.08, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    },
  );
  const insertedCardScale = frame < popEndFrame
    ? insertedPopScale
    : frame < liftEndFrame
      ? insertedPromoteScale
      : insertedAfterLiftScale;
  const insertedCardOpacity = interpolate(frame, [introStillFrames, introStillFrames + 5, scrollStartFrame], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underCardOpacity = 1;
  const underCardExtraY = 0;
  const bottomCardY = firstY + rowGap * mariaIndex + landShift + mariaShift;
  const paginationGap = 10 * k;
  const paginationTop = bottomCardY + cardHpx / 2 + paginationGap;

  const liftShakeIntensity = 0;

  const landShakeProgress = interpolate(frame, [landEndFrame - 4, landEndFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const landShakeIntensity = Math.sin(landShakeProgress * Math.PI) * Math.exp(-1.8 * landShakeProgress);

  const shakeIntensity = Math.max(liftShakeIntensity, landShakeIntensity);
  const shakeAmplitude = 5 * k;
  const sceneShakeX =
    (Math.sin(frame * 1.75) * 0.7 + Math.sin(frame * 3.2 + 0.8) * 0.3) * shakeAmplitude * shakeIntensity;
  const sceneShakeY =
    (Math.cos(frame * 1.95 + 1.1) * 0.65 + Math.sin(frame * 2.8 + 0.4) * 0.35) * shakeAmplitude * shakeIntensity;
  const contentStartOffsetY = contentStartOffsetYPx * k;

  return (
    <AbsoluteFill
      style={{
        background: "#f8faf7",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, #ffffff 0%, #dde7d6 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: movingLayerHeight,
          transform: `translate(${sceneShakeX}px, ${scrollY + sceneShakeY + contentStartOffsetY}px)`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: resultsY,
            left: resultsX,
            width: resultsW,
            borderRadius: (tallAspect ? 18 : 14) * k,
            border: `${1 * k}px solid #d5dbe0`,
            background: "#ffffff",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
            padding: tallAspect
              ? `${26 * k}px ${28 * k}px ${28 * k}px`
              : `${18 * k}px ${20 * k}px ${22 * k}px`,
            marginBottom: resultsPanelMarginBottom,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: (tallAspect ? 24 : 16) * k, color: "#1f2937", fontWeight: 600 }}>
              7653 Resultat
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: (tallAspect ? 12 : 8) * k }}>
              <span style={{ fontSize: (tallAspect ? 18 : 13) * k, color: "#374151" }}>ROT-avdrag</span>
              <div
                style={{
                  width: (tallAspect ? 50 : 36) * k,
                  height: (tallAspect ? 26 : 18) * k,
                  borderRadius: 999,
                  background: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: (tallAspect ? 3 : 2) * k,
                }}
              >
                <div
                  style={{
                    width: (tallAspect ? 20 : 14) * k,
                    height: (tallAspect ? 20 : 14) * k,
                    borderRadius: 999,
                    background: "#ffffff",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.2)",
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: (tallAspect ? 16 : 12) * k,
              height: (tallAspect ? 60 : 42) * k,
              borderRadius: (tallAspect ? 14 : 10) * k,
              border: `${1 * k}px solid #d5dbe0`,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: (tallAspect ? 22 : 16) * k,
              paddingRight: (tallAspect ? 20 : 14) * k,
              fontSize: (tallAspect ? 20 : 13) * k,
              color: "#374151",
            }}
          >
            Sortera
            <ChevronDown size={(tallAspect ? 24 : 16) * k} color="#6b7280" strokeWidth={2} />
          </div>
        </div>

        {COMPANIES.map((company, i) => (
          <Card
            key={company.title}
            x={listX}
            y={firstY + rowGap * i + landShift + (i >= mariaIndex ? mariaShift : 0)}
            title={company.title}
            subtitle={company.subtitle}
            price={company.price}
            driveFee={`${120 + ((i * 37) % 360)} kr`}
            baseFee={`${200 + ((i * 53) % 460)} kr`}
            imageUrl={HANTVERK_IMAGES[i % HANTVERK_IMAGES.length]}
            uiScale={cardUiScale}
            cardWidth={cardWpx}
            cardHeight={cardHpx}
            opacity={i === mariaIndex ? underCardOpacity : 1}
          />
        ))}
        <div
          style={{
            transform: `scale(${insertedCardScale})`,
            transformOrigin: `${listX}px ${insertedCardYWithMargin}px`,
            opacity: insertedCardOpacity,
            zIndex: 6,
            filter: "drop-shadow(0 16px 28px rgba(15,23,42,0.22))",
          }}
        >
          <Card
            x={listX}
            y={insertedCardYWithMargin}
            title="Trygg Bygg Skåne AB"
            subtitle="Larmvägen 17, 113 32 Stockholm"
            price="220"
            driveFee="95 kr"
            baseFee="150 kr"
            imageUrl={HANTVERK_IMAGES[6]}
            uiScale={cardUiScale}
            cardWidth={cardWpx}
            cardHeight={cardHpx}
            verified
            buildProgress={buildProgress}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: paginationTop,
            height: (tallAspect ? 76 : 52) * k,
            borderRadius: (tallAspect ? 22 : 16) * k,
            background: "#334630",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: (tallAspect ? 22 : 16) * k,
            padding: `0px ${(tallAspect ? 32 : 24) * k}px`,
            boxShadow: "0 10px 20px rgba(15, 23, 42, 0.18)",
            zIndex: 4,
            opacity: underCardOpacity,
            transform: `translate(-50%, ${underCardExtraY}px)`,
            marginBottom: paginationMarginBottom,
          }}
        >
          <ChevronsLeft size={(tallAspect ? 24 : 18) * k} color="rgba(255,255,255,0.65)" strokeWidth={2.1} />
          <ChevronLeft size={(tallAspect ? 24 : 18) * k} color="rgba(255,255,255,0.65)" strokeWidth={2.1} />
          <div
            style={{
              width: (tallAspect ? 48 : 34) * k,
              height: (tallAspect ? 48 : 34) * k,
              borderRadius: (tallAspect ? 14 : 10) * k,
              background: "#ffffff",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: (tallAspect ? 24 : 18) * k,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            1
          </div>
          <div style={{ fontSize: (tallAspect ? 24 : 18) * k, fontWeight: 600 }}>2</div>
          <div style={{ fontSize: (tallAspect ? 24 : 18) * k, color: "rgba(255,255,255,0.75)" }}>...</div>
          <div style={{ fontSize: (tallAspect ? 24 : 18) * k, fontWeight: 600 }}>15</div>
          <ChevronRight size={(tallAspect ? 24 : 18) * k} color="rgba(255,255,255,0.9)" strokeWidth={2.1} />
          <ChevronsRight size={(tallAspect ? 24 : 18) * k} color="rgba(255,255,255,0.9)" strokeWidth={2.1} />
        </div>
      </div>

      {showNavbar ? <NavbarMock uiScale={navbarUiScale} /> : null}
    </AbsoluteFill>
  );
};

/** Same `StaticScene` as full composition, scaled to panel width; overflow is clipped vertically when the panel is shorter. */
const ScaledPremiumStaticScene: React.FC<{
  panelWidth: number;
  panelHeight: number;
  segmentFrames: number;
  startDelayFrames?: number;
  contentStartOffsetYPx?: number;
  /** Placera HK-navbar över premiumlistan i split/full panel. */
  showNavbar?: boolean;
}> = ({
  panelWidth,
  panelHeight: _panelHeight,
  segmentFrames,
  startDelayFrames = 0,
  contentStartOffsetYPx = 90,
  showNavbar = true,
}) => {
  const { width: cw, height: ch } = useVideoConfig();
  const widthScale = panelWidth / cw;
  /** Fill panel width; vertical overflow is clipped (panel is top-aligned in split view). */
  const scale = widthScale;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#ffffff" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: cw,
          height: ch,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <StaticScene
          clipDurationInFrames={segmentFrames}
          startDelayFrames={startDelayFrames}
          contentStartOffsetYPx={contentStartOffsetYPx}
          compactContentLayer
          showNavbar={showNavbar}
        />
      </div>
    </div>
  );
};

/** Design size for `HanellGoogleVideo` before scaling into the split-panel slot. */
const HANELL_DESIGN_W = 960;
const HANELL_DESIGN_H = 540;

const ScaledHanellGoogleVideo: React.FC<{
  panelWidth: number;
  panelHeight: number;
}> = ({ panelWidth, panelHeight }) => {
  /** Contain in panel so footer pagination is never clipped (width-only scale overflowed the bottom half). */
  const scale = Math.min(panelWidth / HANELL_DESIGN_W, panelHeight / HANELL_DESIGN_H);
  const scaledHeight = HANELL_DESIGN_H * scale;
  const topOffset = Math.max(0, (panelHeight - scaledHeight) / 2);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#ffffff" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: topOffset,
          width: HANELL_DESIGN_W,
          height: HANELL_DESIGN_H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <HanellGoogleVideo layoutWidth={HANELL_DESIGN_W} layoutHeight={HANELL_DESIGN_H} />
      </div>
    </div>
  );
};

const SPLIT_SCENE_PAD_PX = 12;
const SPLIT_SCENE_ROW_GAP_PX = 10;

const splitPanelBoxStyle: React.CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  position: "relative",
  overflow: "hidden",
  borderRadius: 14,
  background: "#ffffff",
  boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)",
  border: "1px solid rgba(15, 23, 42, 0.06)",
  boxSizing: "border-box",
};

const SplitGoogleAndFormScene: React.FC<{ segmentFrames: number }> = ({ segmentFrames }) => {
  const { width, height } = useVideoConfig();
  const innerW = width - SPLIT_SCENE_PAD_PX * 2;
  const innerH = height - SPLIT_SCENE_PAD_PX * 2;
  const rowHeight = (innerH - SPLIT_SCENE_ROW_GAP_PX) / 2;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(165deg, #f1f5f9 0%, #dde8d4 45%, #cbd5e1 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: SPLIT_SCENE_PAD_PX,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr 1fr",
          columnGap: 0,
          rowGap: SPLIT_SCENE_ROW_GAP_PX,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={splitPanelBoxStyle}>
          <ScaledPremiumStaticScene
            panelWidth={innerW}
            panelHeight={rowHeight}
            segmentFrames={segmentFrames}
            startDelayFrames={18}
            contentStartOffsetYPx={44}
          />
        </div>
        <div style={splitPanelBoxStyle}>
          <ScaledHanellGoogleVideo panelWidth={innerW} panelHeight={rowHeight} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 1) Full-screen: type company name + click “Registrera”.
 * 2) Premium-lista och Hanell Google i två rader (grid 2×1), var sin panel.
 */
export const HantverkskollenSearchJourney: React.FC = () => {
  const { fps } = useVideoConfig();
  const introFrames = getFormSubmitClickFrame(fps);
  /** Matchar HanellGoogleVideo: typewriter+lyft+paus+scroll + 2 s stilla på slutet. */
  const splitFrames = getHanellGoogleMinDurationFrames(fps, 2);
  return (
    <AbsoluteFill style={{ background: "#0f172a" }}>
      <Sequence durationInFrames={introFrames}>
        <IntroCompanyJoinScene />
      </Sequence>
      <Sequence from={introFrames} durationInFrames={splitFrames}>
        <SplitGoogleAndFormScene segmentFrames={splitFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const HantverkskollenAnimation: React.FC = () => <HantverkskollenWithIntro />;
const HantverkskollenWithIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introFrames = getFormSubmitClickFrame(fps);
  const transitionFrames = Math.round(fps * 0.35);
  const introOpacity = interpolate(frame, [introFrames - transitionFrames, introFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const mainOpacity = interpolate(frame, [introFrames - transitionFrames, introFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: mainOpacity }}>
        <StaticScene frameOffset={introFrames} showNavbar />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: introOpacity }}>
        <IntroCompanyJoinScene />
      </div>
    </AbsoluteFill>
  );
};

export const HantverkskollenPremium: React.FC = () => <HantverkskollenWithIntro />;
export const HantverkskollenAd: React.FC = () => <HantverkskollenWithIntro />;

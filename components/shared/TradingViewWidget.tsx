"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  tickers: string[];
}

export default function TradingViewWidget({ tickers }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear container first to avoid duplicate widgets
    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    
    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.style.display = "none"; // Hide copyright label

    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(copyright);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;

    // Build symbols array
    const symbols = tickers.map(t => {
      let displayName = t;
      let ticketString = t;
      if (t.includes(":")) {
        const parts = t.split(":");
        displayName = parts[1];
        ticketString = `${parts[0]}:${parts[1]}|1D`;
      } else {
        ticketString = `NASDAQ:${t}|1D`;
      }
      return [displayName, ticketString];
    });

    const config = {
      "lineWidth": 2,
      "lineType": 0,
      "chartType": "area",
      "fontColor": "rgb(106, 109, 120)",
      "gridLineColor": "rgba(242, 242, 242, 0.06)",
      "volumeUpColor": "rgba(34, 171, 148, 0.5)",
      "volumeDownColor": "rgba(247, 82, 95, 0.5)",
      "backgroundColor": "#0F0F0F",
      "widgetFontColor": "#DBDBDB",
      "upColor": "#22ab94",
      "downColor": "#f7525f",
      "borderUpColor": "#22ab94",
      "borderDownColor": "#f7525f",
      "wickUpColor": "#22ab94",
      "wickDownColor": "#f7525f",
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "es",
      "chartOnly": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "symbols": symbols,
      "dateRanges": [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ],
      "fontSize": "10",
      "headerFontSize": "medium",
      "autosize": true,
      "width": "100%",
      "height": "100%",
      "noTimeScale": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false
    };

    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
  }, [tickers]);

  return (
    <div className="my-8 border border-slate-200/50 rounded-2xl overflow-hidden bg-[#0F0F0F] p-4 shadow-sm w-full h-[400px]">
      <div 
        ref={containerRef} 
        className="tradingview-widget-container w-full h-full"
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

export default function uselastPageCookie() {
  useEffect(() => {
    const currentPath = window.location.pathname;
    Cookies.set("lastPage", currentPath, { expires: 7 }); // 7 days
  }, []);
  
  return Cookies.get("lastPage");
}

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./MenuTap.css";

function MenuTap() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkLogin = async (e, targetPath, newWindow = false) => {
    e.preventDefault(); // 링크 기본 동작을 막음
    console.log("checkLogin 호출됨");
    try {
      const response = await fetch("/process/check-login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });
      const result = await response.json();
      console.log("응답 받음:", result); // 디버깅용 로그
      if (result.loggedIn) {
        if (newWindow) {
          window.open(targetPath, "_blank");
        } else {
          navigate(targetPath); // 로그인 상태라면 원래 가려던 경로로 이동
        }
      } else {
        navigate("/loginpage", { state: { from: targetPath } }); // 로그인되지 않은 상태라면 로그인 페이지로 리디렉션, 원래 경로 저장
      }
    } catch (error) {
      console.error("세션 확인 중 오류 발생:", error);
      navigate("/loginpage", { state: { from: targetPath } }); // 오류 발생 시 로그인 페이지로 리디렉션, 원래 경로 저장
    }
  };

  return (
    <>
      <div className="MenuTap_layout">
        <Link
          className={`navbarMenu ${
            location.pathname === "/" ? "underline" : ""
          }`}
          to="/"
        >
          Home
        </Link>
        <Link
          className={`navbarMenu ${
            location.pathname === "/select/space" ? "underline" : ""
          }`}
          onClick={(e) => checkLogin(e, "/select/space")}
        >
          Reservation
        </Link>
        <Link
          className={`navbarMenu ${
            location.pathname === "/suggest" ? "underline" : ""
          }`}
          onClick={(e) => checkLogin(e, "/suggest")}
        >
          Suggest
        </Link>
        <Link
          className={`navbarMenu ${
            location.pathname === "/notice" ? "underline" : ""
          }`}
          onClick={(e) => checkLogin(e, "/notice")}
        >
          Notice
        </Link>
      </div>
    </>
  );
}

export default MenuTap;

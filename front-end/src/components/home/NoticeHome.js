// import { Link, useLocation, useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./NoticeHome.css";

// function NoticeHome() {
//   const [dataList, setDataList] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const checkLogin = async (e, targetPath, newWindow = false) => {
//     e.preventDefault(); // 링크 기본 동작을 막음
//     console.log("checkLogin 호출됨");
//     try {
//       const response = await fetch("/process/check-login", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include", // 쿠키를 포함하여 요청
//       });
//       const result = await response.json();
//       console.log("응답 받음:", result); // 디버깅용 로그
//       if (result.loggedIn) {
//         if (newWindow) {
//           window.open(targetPath, "_blank");
//         } else {
//           navigate(targetPath); // 로그인 상태라면 원래 가려던 경로로 이동
//         }
//       } else {
//         navigate("/loginpage", { state: { from: targetPath } }); // 로그인되지 않은 상태라면 로그인 페이지로 리디렉션, 원래 경로 저장
//       }
//     } catch (error) {
//       console.error("세션 확인 중 오류 발생:", error);
//       navigate("/loginpage", { state: { from: targetPath } }); // 오류 발생 시 로그인 페이지로 리디렉션, 원래 경로 저장
//     }
//   };

//   useEffect(() => {
//     // 백엔드에서 게시글 목록을 가져옴
//     axios
//       .post(`/notice`)
//       .then((response) => {
//         console.log("응답 데이터:", response.data.posts); // 응답 데이터 출력
//         setDataList(response.data.posts);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the posts!", error);
//       });
//   }, []);

//   return (
//     <div className="Notice_all">
//       <div className="nameLink_layout">
//         <div className="notice_layout">
//           <div className="notice_name">공지사항</div>
//           <Link
//             className="NoticeHome_plus"
//             onClick={(e) => checkLogin(e, "/notice")}
//           >
//             +
//           </Link>
//         </div>
//       </div>
//       <div className="NoticeHome_underline"></div>
//       <div className="Notice_title_body">
//         {dataList.length > 0 ? (
//           (() => {
//             const items = [];
//             for (let i = 0; i < Math.min(3, dataList.length); i++) {
//               items.push(
//                 <div key={i} className="Notice_body">
//                   <div className="HomeNotice_title">{dataList[i].title}</div>
//                 </div>
//               );
//             }
//             return items;
//           })()
//         ) : (
//           <div>Loading...</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NoticeHome;

import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NoticeHome.css";

function NoticeHome() {
  const [dataList, setDataList] = useState([]);
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
        window.scrollTo(0, 0); // 페이지 상단으로 스크롤
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

  useEffect(() => {
    // 백엔드에서 게시글 목록을 가져옴
    axios
      .post(`/notice`)
      .then((response) => {
        console.log("응답 데이터:", response.data.posts); // 응답 데이터 출력
        setDataList(response.data.posts);
      })
      .catch((error) => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []);

  return (
    <div className="Notice_all">
      <div className="nameLink_layout">
        <div className="notice_layout">
          <div className="notice_name">공지사항</div>
          <Link
            className="NoticeHome_plus"
            onClick={(e) => checkLogin(e, "/notice")}
          >
            +
          </Link>
        </div>
      </div>
      <div className="NoticeHome_underline"></div>
      <div className="Notice_title_body">
        {dataList.length > 0 ? (
          (() => {
            const items = [];
            for (let i = 0; i < Math.min(3, dataList.length); i++) {
              items.push(
                <div key={i} className="Notice_body">
                  <div className="HomeNotice_title">{dataList[i].title}</div>
                </div>
              );
            }
            return items;
          })()
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default NoticeHome;

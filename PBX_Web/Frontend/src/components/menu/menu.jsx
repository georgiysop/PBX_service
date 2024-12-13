import s from "./menu.module.css";
import Nec_logo from "./logos/Nec_logo";
import Widgets from "./logos/Widgets_svg";
import Reports from "./logos/Reports_svg";
import Settings from "./logos/Settings_svg";
import Admin from "./logos/Admin_svg";
import GPT from "./logos/GPT_svg";
import Rings from "./logos/Rings_svg";
import Table from "./logos/Table_svg";
import Logout from "./logos/Logout_svg";
import Logo from "./logos/vash_logo.png";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Menu() {
  const handleLogout = async () => {
    try {
      // Отправляем запрос на сервер для выхода из аккаунта
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/logout`,
        {
          method: "POST",
          credentials: "include", // Если используете сессии, добавьте этот параметр
        }
      );

      if (response.ok) {
        // Удаляем токен из localStorage или cookies
        localStorage.removeItem("token"); // или очищаем cookie

        // Перенаправляем на страницу входа (или другую нужную страницу)
        window.location.href = "/login"; // или используйте useHistory() из react-router-dom
      }
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
    }
  };
  return (
    <nav className={s.wrapper}>
      {/* <a href="/Widgets"> */}
      <img src={Logo} className={s.vash_logo} />
      {/* </a> */}
      <div className={s.styleMenu}>
        <ul>
          <NavLink
            to="/Widgets"
            className={(navData) => (navData.isActive ? s.active : s.item)}
          >
            <li className={s.item}>
              <Widgets className={s.logo} />
              Виджеты
            </li>
          </NavLink>
          <NavLink
            to="/Rings"
            className={(navData) => (navData.isActive ? s.active : s.item)}
          >
            <li className={s.item} id={s.item_last}>
              <Rings className={s.logo} />
              Звонки
            </li>
          </NavLink>
          <NavLink
            to="/Reports"
            className={(navData) => (navData.isActive ? s.active : s.item)}
          >
            <li className={s.item}>
              <Reports className={s.logo} />
              Отчеты
            </li>
          </NavLink>

          <NavLink
            to="/Admin"
            className={(navData) => (navData.isActive ? s.active : s.item)}
          >
            <li className={s.item}>
              <Table className={s.logo} />
              Таблицы
            </li>
          </NavLink>

          <Link
            to="/logout"
            onClick={handleLogout}
            className={(navData) => (navData.isActive ? s.active : s.item)}
          >
            <li className={s.item}>
              <Logout className={s.logo} />
              Выйти
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}

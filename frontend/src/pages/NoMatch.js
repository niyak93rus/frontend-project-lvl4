// import {
//   useLocation
// } from "react-router-dom";

import { Link } from 'react-router-dom';

const NoMatch = () => {
  return (
    <div>
    <h1>404 - Страница не найдена!</h1>
    <Link to="/">Вернуться на главную</Link>
    </div>
  )
};

export default NoMatch;
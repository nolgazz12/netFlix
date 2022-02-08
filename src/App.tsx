import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Routes/Home'
import Search from './Routes/Search'
import Tv from './Routes/Tv'

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/tv" element={<Tv />}></Route>
                <Route path="/search" element={<Search />}></Route>
                <Route path="/" element={<Home />}></Route>
            </Routes>
        </BrowserRouter>
    )
}
// path 가 / 인 route 는 맨 아래에 두어야함 안그러면 다른 route 눌러도 / 가 존재하니까 router가 일치하는 부분을 찾아내서 url 만 이동함
export default App

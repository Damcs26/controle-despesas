import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import CategoriaPage from "./pages/CategoriaPage";
import PessoaPage from "./pages/PessoaPage";
import TransacaoPage from "./pages/TransacaoPage";
import TotaisPessoaPage from "./pages/TotaisPessoaPage";
import TotaisCategoriaPage from "./pages/TotaisCategoriaPage";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Navigate to="/categorias" />} />
        <Route path="/categorias" element={<CategoriaPage />} />
        <Route path="/pessoas" element={<PessoaPage />} />
        <Route path="/transacoes" element={<TransacaoPage />} />
        <Route path="/totais-pessoa" element={<TotaisPessoaPage />} />
        <Route path="/totais-categoria" element={<TotaisCategoriaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
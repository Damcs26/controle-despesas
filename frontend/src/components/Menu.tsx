import { Link, useLocation } from "react-router-dom";

export default function Menu() 
{
  const { pathname } = useLocation();

  // Estilo base de cada item do menu
  function estiloLink(rota: string) 
  {
    return {
      textDecoration: "none",
      padding: "8px 16px",
      borderRadius: 4,
      // Destaca o item da página atual
      background: pathname === rota ? "#2c6fad" : "transparent",
      color: "white",
      fontWeight: pathname === rota ? "bold" : "normal",
    } as React.CSSProperties;
  }

  return (
    <nav style={{ background: "#4a90d9", padding: "12px 32px", display: "flex", gap: 8 }}>
      <Link to="/categorias" style={estiloLink("/categorias")}>Categorias</Link>
      <Link to="/pessoas" style={estiloLink("/pessoas")}>Pessoas</Link>
      <Link to="/transacoes" style={estiloLink("/transacoes")}>Transações</Link>
      <Link to="/totais-pessoa" style={estiloLink("/totais-pessoa")}>Totais por Pessoa</Link>
      <Link to="/totais-categoria" style={estiloLink("/totais-categoria")}>Totais por Categoria</Link>
    </nav>
  );
}
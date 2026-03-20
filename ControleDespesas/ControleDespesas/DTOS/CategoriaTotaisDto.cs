namespace ControleDespesas.DTOs
{
    // Retorno dos totais financeiros de cada categoria
    public class CategoriaTotaisDto
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public string Finalidade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        // Saldo = Receitas - Despesas
        public decimal Saldo { get; set; }
    }

    // Retornor da listagem completa com o total geral no final
    public class ResumoGeralCategoriaDto
    {
        // Lista com os totais de cada categoria
        public List<CategoriaTotaisDto> Categorias { get; set; }

        // Totais somando todas as categorias
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}
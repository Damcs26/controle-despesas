namespace ControleDespesas.DTOs
{
    // Retorno dos totais financeiros por pessoa
    public class PessoaTotaisDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        // Saldo = Receitas - Despesas
        public decimal Saldo { get; set; }
    }

    // Retorno para a listagem completa com o total gerado
    public class ResumoGeralDto
    {
        // Lista com os totais de cada pessoa
        public List<PessoaTotaisDto> Pessoas { get; set; }

        // Totais somando todas as pessoas
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}
namespace ControleDespesas.Models
{
    public enum TipoTransacao
    {
        Despesa,
        Receita
    }
    public class Transacao
    {
        public int Id { get; set; } //deve ser um valor unico gerado autoamticamente 
        public string Descricao { get; set; }
        public decimal Valor { get; set; } // Numero postivo
        public TipoTransacao Tipo { get; set;} // Despesa/receita

        //Conexoes entre as tabelas
        public int CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }
        public int PessoaId { get; set; }
        public Pessoa? Pessoa { get; set; }
    }
}

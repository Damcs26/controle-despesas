namespace ControleDespesas.Models
{
    public class Pessoa
    {
        //Espelho da tabela Pessoa no Banco de Dados
        public int Id { get; set; } //deve ser um valor unico gerado autoamticamente 
        public string Nome { get; set; }
        public DateOnly DataNascimento { get; set; } // alterado para acompanhar a mudança de idade
    }
}

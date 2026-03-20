using System.Globalization;

namespace ControleDespesas.Models
{
    public enum FinalidadeCategoria
    {
        Despesa,
        Receita,
        Ambas
    }

    public class Categoria
    {
        //Espelho da tabela Categoria no banco de dados
        public int Id { get; set; } //deve ser um valor unico gerado autoamticamente 
        public string Descricao { get; set; }
        public FinalidadeCategoria Finalidade { get; set; } // despesa/receita/ambas
    }
}

namespace ControleDespesas.DTOs
{
    public class PessoaResponseDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string? Aviso { get; set; }
    }
}
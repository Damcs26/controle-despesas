using ControleDespesas.Models;
using ControleDespesas.Repositories;
using ControleDespesas.DTOs;

namespace ControleDespesas.Services
{
    public class PessoaService
    {
        private readonly PessoaRepository _repository;
        private readonly TransacaoRepository _transacaoRepository;

        // Injeta os dois repositories necessários
        public PessoaService(PessoaRepository repository, TransacaoRepository transacaoRepository)
        {
            _repository = repository;
            _transacaoRepository = transacaoRepository;
        }

        public async Task<List<Pessoa>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Pessoa> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<PessoaResponseDto> Create(Pessoa pessoa)
        {
            var hoje = DateOnly.FromDateTime(DateTime.Now);

            if (pessoa.DataNascimento > hoje)
                throw new Exception("A data de nascimento não pode ser maior que a data atual.");

            // Calcula a idade
            var idade = hoje.Year - pessoa.DataNascimento.Year;
            if (pessoa.DataNascimento > hoje.AddYears(-idade)) idade--;

            var pessoaCriada = await _repository.Create(pessoa);

            var response = new PessoaResponseDto
            {
                Id = pessoaCriada.Id,
                Nome = pessoaCriada.Nome,
                DataNascimento = pessoaCriada.DataNascimento,
                // Se menor de 18, adiciona o aviso — senão deixa null
                Aviso = idade < 18 ? $"Atenção: Como {pessoaCriada.Nome} tem menos que 18 anos só poderá lançar despesas." : null
            };

            return response;
        }

        public async Task<ResumoGeralDto> GetTotaisPorPessoa()
        {
            var pessoas = await _repository.GetAll();
            var transacoes = await _transacaoRepository.GetAll();

            var pessoasTotais = pessoas.Select(pessoa =>
            {
                // Filtra as transações da pessoa atual
                var transacoesDaPessoa = transacoes.Where(t => t.PessoaId == pessoa.Id);

                var totalReceitas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                return new PessoaTotaisDto
                {
                    Id = pessoa.Id,
                    Nome = pessoa.Nome,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas
                };
            }).ToList();

            return new ResumoGeralDto
            {
                Pessoas = pessoasTotais,
                TotalGeralReceitas = pessoasTotais.Sum(p => p.TotalReceitas),
                TotalGeralDespesas = pessoasTotais.Sum(p => p.TotalDespesas),
                SaldoLiquido = pessoasTotais.Sum(p => p.Saldo)
            };
        }

        public async Task<Pessoa?> Update(int id, Pessoa updatePessoa)
        {
            var pessoa = await _repository.GetById(id);

            if (pessoa == null) return null;

            pessoa.Nome = updatePessoa.Nome;
            pessoa.DataNascimento = updatePessoa.DataNascimento;

            return await _repository.Update(pessoa);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}
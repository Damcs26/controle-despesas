using ControleDespesas.Models;
using ControleDespesas.Repositories;

namespace ControleDespesas.Services
{
    public class TransacaoService
    {
        private readonly TransacaoRepository _repository;
        private readonly PessoaRepository _pessoaRepository;
        private readonly CategoriaRepository _categoriaRepository;

        // Injeta os 3 repositories necessários para as validações
        public TransacaoService(
            TransacaoRepository repository,
            PessoaRepository pessoaRepository,
            CategoriaRepository categoriaRepository)
        {
            _repository = repository;
            _pessoaRepository = pessoaRepository;
            _categoriaRepository = categoriaRepository;
        }

        public async Task<List<Transacao>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Transacao?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Transacao> Create(Transacao transacao)
        {
            // Busca a Pessoa e a Categoria para validar as regras
            var pessoa = await _pessoaRepository.GetById(transacao.PessoaId);
            if (pessoa == null)
                throw new Exception("Pessoa não encontrada.");

            var categoria = await _categoriaRepository.GetById(transacao.CategoriaId);
            if (categoria == null)
                throw new Exception("Categoria não encontrada.");

            // Regra: menor de 18 anos só pode lançar Despesa
            var hoje = DateOnly.FromDateTime(DateTime.Now);
            var idade = hoje.Year - pessoa.DataNascimento.Year;
            if (pessoa.DataNascimento > hoje.AddYears(-idade)) idade--;

            if (idade < 18 && transacao.Tipo == TipoTransacao.Receita)
                throw new Exception($"{pessoa.Nome} tem menos de 18 anos e só pode lançar despesas.");

            // Regra: categoria deve ser compatível com o tipo da transação
            if (categoria.Finalidade == FinalidadeCategoria.Receita && transacao.Tipo == TipoTransacao.Despesa)
                throw new Exception($"A categoria '{categoria.Descricao}' é exclusiva para receitas.");

            if (categoria.Finalidade == FinalidadeCategoria.Despesa && transacao.Tipo == TipoTransacao.Receita)
                throw new Exception($"A categoria '{categoria.Descricao}' é exclusiva para despesas.");

            // Regra: valor deve ser positivo
            if (transacao.Valor <= 0)
                throw new Exception("O valor da transação deve ser maior que zero.");

            return await _repository.Create(transacao);
        }

        public async Task<Transacao?> Update(int id, Transacao updateTransacao)
        {
            var transacao = await _repository.GetById(id);

            if (transacao == null) return null;

            transacao.Descricao = updateTransacao.Descricao;
            transacao.Valor = updateTransacao.Valor;
            transacao.Tipo = updateTransacao.Tipo;
            transacao.CategoriaId = updateTransacao.CategoriaId;
            transacao.PessoaId = updateTransacao.PessoaId;

            return await _repository.Update(transacao);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}
using ControleDespesas.DTOs;
using ControleDespesas.Models;
using ControleDespesas.Repositories;

namespace ControleDespesas.Services
{
    public class CategoriaService
    {
        //Responsabilidade única regras de negócio 
        //Aqui não existe contato direto com o banco de dados

        private readonly CategoriaRepository _repository;
        private readonly TransacaoRepository _transacaoRepository;

        public CategoriaService(CategoriaRepository repository, TransacaoRepository transacaoRepository)
        {
            _repository = repository;
            _transacaoRepository = transacaoRepository;
        }
        //O Repository criado é injetado ppela API
        public CategoriaService(CategoriaRepository repository)
            {
                _repository = repository;
            }

        //Listar todas as categorias
        public async Task<List<Categoria>> GetAll()
        {
            return await _repository.GetAll();
        }
        //Listagem por id
        public async Task<Categoria?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        //Criação de categoria, aplicando regra da descrição não poder ser vazia
        public async Task<Categoria> Create(Categoria categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Descricao))
                throw new Exception("Preencha a descrição da categoria!");
                
            return await _repository.Create(categoria);
        }

        // Retorna os totais financeiros de cada categoria e o resumo geral
        public async Task<ResumoGeralCategoriaDto> GetTotaisPorCategoria()
        {
            var categorias = await _repository.GetAll();
            var transacoes = await _transacaoRepository.GetAll();

            var categoriasTotais = categorias.Select(categoria =>
            {
                // Filtra as transações da categoria atual
                var transacoesDaCategoria = transacoes.Where(t => t.CategoriaId == categoria.Id);

                var totalReceitas = transacoesDaCategoria
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = transacoesDaCategoria
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                return new CategoriaTotaisDto
                {
                    Id = categoria.Id,
                    Descricao = categoria.Descricao,
                    // Converte o enum para string para ficar legível no JSON
                    Finalidade = categoria.Finalidade.ToString(),
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas
                };
            }).ToList();

            return new ResumoGeralCategoriaDto
            {
                Categorias = categoriasTotais,
                TotalGeralReceitas = categoriasTotais.Sum(c => c.TotalReceitas),
                TotalGeralDespesas = categoriasTotais.Sum(c => c.TotalDespesas),
                SaldoLiquido = categoriasTotais.Sum(c => c.Saldo)
            };
        }
        //Edição de uma categoria, aplicando regra da categoria precisasr de exitir
        public async Task<Categoria?> Update (int id, Categoria updateCategoria)
            {
                var categoria = await _repository.GetById(id);

                if(categoria == null)
                {
                    return null;
                }

                categoria.Descricao = updateCategoria.Descricao;
                categoria.Finalidade = updateCategoria.Finalidade;

                return await _repository.Update(categoria);
            }

        public async Task<bool> Delete(int id)
            {
                return await _repository.Delete(id);
            }          
    }
}

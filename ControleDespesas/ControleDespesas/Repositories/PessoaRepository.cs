using ControleDespesas.Data;
using ControleDespesas.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDespesas.Repositories
{
    public class PessoaRepository
    {
        private readonly AppDbContext _context;

        public PessoaRepository(AppDbContext context)
        {
            _context = context;
        }

        //Lista todas as pessoas registradas
        public async Task<List<Pessoa>> GetAll()
        {
            return await _context.Pessoas.ToListAsync();
        }
        //Lista por id as pessoas registradas
        public async Task<Pessoa> GetById(int id)
        {
            return await _context.Pessoas.FindAsync(id);
        }

        //Cria o cadastro
        public async Task<Pessoa> Create(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return pessoa;
        }

        public async Task<Pessoa> Update(Pessoa pessoa)
        {
            _context.Pessoas.Update(pessoa);
            await _context.SaveChangesAsync();
            return pessoa;
        }

        public async Task<bool> Delete(int id)
        {
            var pessoa = await GetById(id);
            if (pessoa == null) return false;

            // Busca e remove todas as transações da pessoa antes de deletá-la
            var transacoes = await _context.Transacoes
                .Where(t => t.PessoaId == id)
                .ToListAsync();

            _context.Transacoes.RemoveRange(transacoes);
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

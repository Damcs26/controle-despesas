using ControleDespesas.Data;
using ControleDespesas.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDespesas.Repositories
{
    public class TransacaoRepository
    {
        private readonly AppDbContext _context;

        public TransacaoRepository(AppDbContext context)
        {
            _context = context;
        }

        //Lista todas as transacao registradas,trazendo as chaves
        public async Task<List<Transacao>> GetAll()
        {
            return await _context.Transacoes
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .ToListAsync();
        }
        //Lista por id as transacao registradas, trazendo as chaves
        public async Task<Transacao?> GetById(int id)
        {
            return await _context.Transacoes
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        //Cria o cadastro
        public async Task<Transacao> Create(Transacao transacao)
        {
            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();
            return transacao;
        }

        public async Task<Transacao> Update(Transacao transacao)
        {
            _context.Transacoes.Update(transacao);
            await _context.SaveChangesAsync();
            return transacao;
        }

        public async Task<bool> Delete(int id)
        {
            var transacao = await GetById(id);
            if (transacao == null)
            {
                return false;
            }

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

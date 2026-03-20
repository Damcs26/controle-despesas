using ControleDespesas.Models;
using ControleDespesas.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDespesas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly TransacaoService _service;
        public TransacaoController(TransacaoService service)
        {
            _service = service;
        }

        //GET - Listagem de todas as transacoes lancadas
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transacoes = await _service.GetAll();
            return Ok(transacoes);
        }

        //GET - Busca por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var transacoes = await _service.GetById(id);
            if (transacoes == null)
            {
                return NotFound("Essa transação não foi encontrada");
            }

            return Ok(transacoes);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Transacao transacao)
        {
            try
            {
                var criada = await _service.Create(transacao);
                return CreatedAtAction(nameof(GetById), new { id = criada.Id }, criada);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Transacao transacao)
        {
            var atualiza = await _service.Update(id, transacao);
            if (atualiza == null)
            {
                return NotFound("Não foi possível salvar!Transação não encontrada");
            }

            return Ok(atualiza);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deletado = await _service.Delete(id);
            if (!deletado)
            {
                return NotFound("Não foi possível excluir!Transação não encontrada");
            }
            return NoContent();
        }

    }
}

using ControleDespesas.Models;
using ControleDespesas.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDespesas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly PessoaService _service;
        public PessoaController(PessoaService service)
        {
            _service = service;
        }

        //GET - Listagem de todas as pessoas cadastradas
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pessoas = await _service.GetAll();
            return Ok(pessoas);
        }

        //GET - Busca por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pessoas = await _service.GetById(id);
            if (pessoas == null)
            {
                return NotFound("Pessoa não encontrada");
            }

            return Ok(pessoas);
        }

        [HttpGet("totais")]
        public async Task<IActionResult> GetTotaisPorPessoa()
        {
            var resumo = await _service.GetTotaisPorPessoa();
            return Ok(resumo);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pessoa pessoa)
        {
            try
            {
                var criada = await _service.Create(pessoa);
                return CreatedAtAction(nameof(GetById), new { id = criada.Id }, criada);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Pessoa pessoa)
        {
            var atualiza = await _service.Update(id, pessoa);
            if(atualiza == null)
            {
                return NotFound("Não foi possível salvar!Pessoa não encontrada");
            }

            return Ok(atualiza);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete (int id)
        {
            var deletado = await _service.Delete(id);
            if(!deletado)
            {
                return NotFound("Não foi possível excluir!Pessoa não encontrada");
            }
            return NoContent();
        }

    }
}

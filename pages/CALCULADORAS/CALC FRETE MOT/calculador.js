document.addEventListener('DOMContentLoaded', function() {
    function formatNumber(number) {
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function parseFormattedNumber(str) {
        return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    }

    $('#valordoFrete, #pedagio').on('input', function(e) {
        var value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        e.target.value = formatNumber(parseFloat(value));
    });

    $('#peso').on('input', function(e) {
        var value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 1000).toFixed(3);
        e.target.value = value.replace('.', ',');
    });

    const valordoFrete = document.getElementById('valordoFrete');
    const pedagio = document.getElementById('pedagio');
    const peso = document.getElementById('peso');
    const botao = document.getElementById('botao');
    const clean = document.getElementById('clean');
    const freteUnitario = document.getElementById('freteUnitario');
    const adiantamento = document.getElementById('adiantamento');

    const getAdiantamentoPorcentagem = () => {
        const radios = document.getElementsByName('porcentagem_adiantamento');
        for (const radio of radios) {
            if (radio.checked) {
                return parseFloat(radio.value); 
            }
        }
        return 0.7; 
    };

    const calculodosValores = () => {
        const valorFreteNum = parseFormattedNumber(valordoFrete.value);
        const pedagioNum = parseFormattedNumber(pedagio.value);
        const pesoNum = parseFloat(peso.value.replace(',', '.'));

        var pedagioComDesconto = pedagioNum ? pedagioNum / pesoNum : 0;
        var resultadoParcial = valorFreteNum - pedagioComDesconto;
        var valorDoFreteSemDescontoAjusteQuatro = resultadoParcial * pesoNum;

        // Obtém a porcentagem de adiantamento selecionada
        var porcentagemAdiantamento = getAdiantamentoPorcentagem();
        var adiantamentoAjuste = valorDoFreteSemDescontoAjusteQuatro * porcentagemAdiantamento;
        
        // Ajuste para seguro
        var adiantamentoAjusteComSeguro = adiantamentoAjuste * (1 - 0.018);
        var adiantamentoReal = adiantamentoAjusteComSeguro.toFixed(2);

        return [resultadoParcial, adiantamentoReal];
    };

    botao.addEventListener('click', function() {
        if (valordoFrete.value === '' || peso.value === '') {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const [resultado, adiantamentoValue] = calculodosValores();
        freteUnitario.value = resultado.toFixed(2); 
        adiantamento.value = adiantamentoValue;
    });

    clean.addEventListener('click', function() {
        document.getElementById('valordoFrete').value = "";
        document.getElementById('pedagio').value = "";
        document.getElementById('peso').value = "";
        document.getElementById('freteUnitario').value = "";
        document.getElementById('adiantamento').value = "";
        
        // Limpa a seleção dos radios
        const radios = document.getElementsByName('porcentagem_adiantamento');
        for (const radio of radios) {
            radio.checked = false;
        }
    });
});

 
onload= init;

var objJSON;
var numeroDeObjetos;

function init(){
    var btn = document.getElementById("gerar");
    btn.onclick = requisitarDadosDoWebService;
   
}


function requisitarDadosDoWebService(){
	var httpReq = new XMLHttpRequest();
	var nVersao = document.getElementById("n1").value;
	httpReq.onreadystatechange = function(){
		if(httpReq.readyState == 4){
			objJSON = JSON.parse(httpReq.responseText);
			criarTabela();
		}
	};
	
	httpReq.open("GET",	"http://localhost:8080/findByObservacaoVersao?observacao=V%20"+nVersao,true);
	httpReq.withCredentials = true;
	httpReq.send();
	
	
}



function criarTabela(){
   
    numeroDeObjetos = Object.keys(objJSON).length;
	
    var tabela = document.getElementById("teste");
	
	//limpando a tabela
	  while (tabela.rows.length > 1)
     { tabela.deleteRow(tabela.rows.length - 1);
	 }
    
      for(var i = 0;i< numeroDeObjetos; i++){
         var linha = document.createElement("tr");
		 var nPendencias = Object.keys(objJSON[i].pendencias).length;
						
        
        for (var j=0; j<=5 ;j++){
			var cell = document.createElement("td");
			
			if(j==0){
				var cellText = document.createTextNode(objJSON[i].cod_os_nominal);
				cell.appendChild(cellText);
				linha.appendChild(cell);
				
			}else if(j==1){
				var total=0;
				var str = "REVISÃO DE CÓDIGO";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}					
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
				
			}else if(j==2){
				var total=0;
				var str = "AJUSTES DE REVISÃO DE CÓDIGO";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}					
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
					
			}else if(j==3){
				var total=0;
				var str = "TESTE";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}					
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
				
				
			}else if(j==4){
				
				var total = 0;
				var str = "AJUSTE DE TESTE";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}					
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
				
			}else{
				var input = document.createElement("input");
				cell.appendChild(input);
				linha.appendChild(cell);
			}
			
        }
        tabela.appendChild(linha);
    }
    
       porcentagemPrioridade();
	   porcentagemOcorrência();
	   //gerarPDF();
}



function porcentagemPrioridade(){
	var vetCont = [0,0,0,0];
	
	
	for(var i=0;i< numeroDeObjetos;i++){
		var str = objJSON[i].prioridade.descricao;
		
		if(str.localeCompare("BAIXA")==0){
			vetCont[0]++;			
		}else if(str.localeCompare("MÉDIA")==0){
			vetCont[1]++;
		}else if(str.localeCompare("ALTA")==0){
			vetCont[2]++;
		}else{
			vetCont[3]++;
		}
	}	
	 
	
		var campo2 = document.getElementById("campo2");
		
		var text = document.createTextNode("total de "+numeroDeObjetos+ " > 100%");
		//campo2.appendChild(text);
		for(var j=0;j<4;j++){
			var p= (vetCont[j]*100)/numeroDeObjetos;
			
			switch(j){
				case 0:text = document.createTextNode("Baixa: "+parseFloat(p.toFixed(2))+ "%");break;
				case 1:text = document.createTextNode("Média: "+parseFloat(p.toFixed(2))+ "%");break;
				case 2:text = document.createTextNode("Alta: "+parseFloat(p.toFixed(2))+ "%");break;
				case 3:text = document.createTextNode("Muito Alta: "+parseFloat(p.toFixed(2))+ "%");
			}
			campo2.appendChild(text);
		}
		
		$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Abertura de Ordem de Serviço pela Prioridade'   
			   };   
			   var tooltip = {
				  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'Prioridade com',
						data: [
							['BAIXA',  parseFloat(((vetCont[0]*100)/numeroDeObjetos).toFixed(2))],
							['MÉDIA',    parseFloat(((vetCont[1]*100)/numeroDeObjetos).toFixed(2))  ],
							['ALTA', parseFloat(((vetCont[2]*100)/numeroDeObjetos).toFixed(2)) ],
							['MUITO ALTA',   parseFloat(((vetCont[3]*100)/numeroDeObjetos).toFixed(2)) ],
							
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo2').highcharts(json);  
					
		
		});	
	
}


function porcentagemOcorrência(){
	var vetCont = [0,0,0,0,0];
	
	for(var i=0;i< numeroDeObjetos;i++){
		var str = objJSON[i].ocorrencias[0].descricao;
	
		if(str.localeCompare("MELHORIA NO SISTEMA")==0){
				vetCont[0]++;		
			}else if(str.localeCompare("BUG EM PRODUÇÃO")==0){
				vetCont[1]++;
			}else if(str.localeCompare("OCORRÊNCIA EM PRODUÇÃO")==0){
				vetCont[2]++;
			}else if(str.localeCompare("SOLICITAÇÃO")==0){
				vetCont[3]++;
			}else{
				vetCont[4]++;
			}
	}		
			
			var campo3 = document.getElementById("campo3");
		
		var text = document.createTextNode("total de "+numeroDeObjetos+ " > 100%");
		//campo2.appendChild(text);
		for(var j=0;j<5;j++){
			var o= (vetCont[j]*100)/numeroDeObjetos;
			
			switch(j){
				case 0:text = document.createTextNode("MELHORIA NO SISTEMA: "+parseFloat(o.toFixed(2))+ "%");break;
				case 1:text = document.createTextNode("BUG EM PRODUÇÃO: "+parseFloat(o.toFixed(2))+ "%");break;
				case 2:text = document.createTextNode("OCORRÊNCIA EM PRODUÇÃO: "+parseFloat(o.toFixed(2))+ "%");break;
				case 3:text = document.createTextNode("SOLICITAÇÃO: "+parseFloat(o.toFixed(2))+ "%");break;
				case 4:text = document.createTextNode("DATAFIX: "+parseFloat(o.toFixed(2))+ "%");
			}
			campo3.appendChild(text);
		}
			
			
			$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Abertura de Ordem de Serviço pelo tipo de Ocorrência'   
			   };   
			   var tooltip = {
				  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'Ocorrência com',
						data: [
							['MELHORIA NO SISTEMA',  parseFloat(((vetCont[0]*100)/numeroDeObjetos).toFixed(2))],
							['BUG EM PRODUÇÃO',    parseFloat(((vetCont[1]*100)/numeroDeObjetos).toFixed(2))  ],
							['OCORRÊNCIA EM PRODUÇÃO', parseFloat(((vetCont[2]*100)/numeroDeObjetos).toFixed(2)) ],
							['SOLICITAÇÃO',   parseFloat(((vetCont[3]*100)/numeroDeObjetos).toFixed(2)) ],
							['DATAFIX',   parseFloat(((vetCont[4]*100)/numeroDeObjetos).toFixed(2))],
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo3').highcharts(json);  
					
		
		});	
				
}



/*
function gerarPDF(){
	
	var body = document.getElementById("conteudo");
	html2canvas(conteudo,{
		onrendered: function(canvas){
			
			var img = canvas.toDataURL("image/png");
			var doc = new jsPDF();
			doc.addImage(img, 'JPEG',10,50);
			doc.save("teste.pdf");
			
		} 
		
		
	});
	
}*/



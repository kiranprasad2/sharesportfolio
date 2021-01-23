import React from 'react';
import './DashBoard.css';
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

class DashBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sharesTable: [],
            stockChartXValues: {},
            stockChartYValues: {},
            currentStock: '',
            showTable: false,
            showChart: false,
            IsArray: [],
            selectedTicker:'',
            search: '',
            sharesList: [<option key='None' value='None'>Select the ticker</option>]
        }
        //this.fetchStock = this.fetchStock.bind(this);
    }
    /*componentDidMount() {
        this.fetchStock();
    }*/
    shareSelected = async (e) => {
        e.preventDefault();
        //const ticker = document.getElementById("tickerId");
        if (e.target.value !== "") {
            await this.setState({
                selectedTicker: e.target.value,
            });
            
        }
    }
    addTicker = async(e) => {
        e.preventDefault();
        const ticker = document.getElementById("tickerId");
        if (ticker.value!=="") {
            await this.setState({
                search: ticker.value,
                selectedTicker: ticker.value,
            });
            
            this.fetchStock();
            //this.onchange();
            
        }
        
       
    }
    fetchStock = () => {

        let newDate = new Date((new Date()).valueOf() - 1000*60*60*24);
        let date =  newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let tablekey = `${year}-${month<10?`0${month}`:`${month}`}-${date}`;
        let StockSymbol = this.state.search;
        const pointerToThis = this;
        const API_KEY = '15B5S5ZNVIMAV22S';
        let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`;
        let stockChartXValuesFunction = [];
        let stockChartYValuesFunction = [];
        let stockChartXValuesHT = this.state.stockChartXValues;
        let stockChartYValuesHT = this.state.stockChartYValues;
        let gsharesTable = this.state.sharesTable;
        let gsharesList = this.state.sharesList;
        let open,close;
        fetch(API_Call)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (data) {
                    console.log(data);
                                      
                    for (var key in data['Time Series (Daily)']) {
                        stockChartXValuesFunction.push(key);
                        stockChartYValuesFunction.push(data['Time Series (Daily)'][key]['1. open']);
                        if(key===tablekey)
                        {
                            open=data['Time Series (Daily)'][key]['1. open']; 
                            close = data['Time Series (Daily)'][key]['4. close'];
                            gsharesTable.push({ ticker: `${StockSymbol}`, open: `${open}`, close: `${close}`, gain: `${close}` - `${open}` });
                            gsharesList.push(<option selected key={StockSymbol} value={StockSymbol}>{StockSymbol}</option>);
                        }
                    }
                    stockChartXValuesHT[`${StockSymbol}`] = stockChartXValuesFunction;
                    stockChartYValuesHT[`${StockSymbol}`] = stockChartYValuesFunction;
                    
                    pointerToThis.setState({
                        stockChartXValues: stockChartXValuesHT,
                        stockChartYValues: stockChartYValuesHT,
                        sharesTable: gsharesTable,
                        showTable: true,
                        sharesList: gsharesList
                    });
                }
            )
    }
  
    sharesTableHeader() {
        if (this.state.showTable == true) {
            let header = Object.keys(this.state.sharesTable[0])
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }
   }


    sharesTableData() {
        return this.state.sharesTable.map((shareInfo, index) => {
            const { ticker, open, close, gain } = shareInfo //destructuring
            return (
                <tr key={ticker}>
                    <td>{ticker}</td>
                    <td>{open}</td>
                    <td>{close}</td>
                    <td>{gain}</td>
                </tr>
            )
        })
    }
    render() {
        return (
            <div>
                <div>
                    <div>
                        
                        <input type="text" id="tickerId" placeholder="Enter Ticker Symbol"/>
                        <button onClick={this.addTicker.bind(this)}> Add Ticker </button>
                        <label> Select the Ticker
                        <select onChange={this.shareSelected} >
                            {this.state.sharesList}
                        </select>
                        </label>
                    </div>
                    <div>
                    <Plot
                    data={[
                        {
                            x: this.state.stockChartXValues[this.state.selectedTicker],
                            y: this.state.stockChartYValues[this.state.selectedTicker],
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: { color: 'red' },
                        }

                    ]}
                        layout={{
                            width: 720, height: 440, title: this.state.selectedTicker}}
                    />
                    </div>

                </div>
                <div>
                    <div>
                        <h1 id='tableName'>Shares Information Table</h1>
                        <table id='shares'>
                            <tbody>
                                <tr>{this.sharesTableHeader()}</tr>
                                {this.sharesTableData()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
           
           
            
        )

    }




}
export default DashBoard;

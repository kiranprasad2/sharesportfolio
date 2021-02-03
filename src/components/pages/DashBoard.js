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
            showTable: false,
            showChart: false,
            selectedTicker:'',
            sharesList: [<option key='None' value='None'>Select the ticker</option>]
        }
        //this.fetchStock = this.fetchStock.bind(this);
    }
    
    loadStore = async (e) =>{
        let val  = localStorage.getItem("sharesTable");
        let val1 = localStorage.getItem("stockChartXValues");
        let val2 = localStorage.getItem("stockChartYValues");
        let val3 = localStorage.getItem("showTable");
        let val4 = localStorage.getItem("showChart");
        let val5 = localStorage.getItem("selectedTicker");
        let val6 = localStorage.getItem("sharesList");
        try {
            val = JSON.parse(val);
            val1 = JSON.parse(val1);
            val2 = JSON.parse(val2);
            val3 = JSON.parse(val3);
            val4 = JSON.parse(val4);
            val5 = JSON.parse(val5);
            val6 = JSON.parse(val6);
            await this.setState({ sharesTable: val });
            await this.setState({ stockChartXValues: val1 });
            await this.setState({ stockChartYValues: val2 });
            await this.setState({ showTable: val3 });
            await this.setState({ showChart: val4 });
            await this.setState({ selectedTicker: val5 });
            let dropDownSharesList=[];
            for (let tName in this.state.stockChartXValues)
                dropDownSharesList.push(<option selected key={tName} value={tName}>{tName}</option>);
            await this.setState({ sharesList: dropDownSharesList });

        } catch (e) {
                    await this.setState({ key: val1 });
        }
        
    }

    refreshStore() {
        for (let key in this.state) {
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }    
    }

    componentDidMount() {
        let val = localStorage.getItem("showTable");
        if (JSON.parse(val)===true) {
            this.loadStore();
        }
        window.addEventListener("beforeunload", this.refreshStore.bind(this));
        localStorage.clear();
        
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.refreshStore.bind(this));
        this.refreshStore();
    }

   /* componentDidUpdate() {
        this.refreshStore();
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
                //search: ticker.value,
                selectedTicker: ticker.value,
            });
            
            this.fetchStock();
            //this.onchange();
            
        }
        
       
    }
    fetchStock = () => {

        /*let newDate = new Date((new Date()).valueOf() - 1000*60*60*24);
        let date =  newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let tablekey = `${year}-${month<10?`0${month}`:`${month}`}-${date<10?`0${date}`:`${date}`}`;*/
        //let StockSymbol = this.state.search;
        let StockSymbol = this.state.selectedTicker;
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
                    //console.log(tablekey); 
                    let firstkey = true;
                    for (var key in data['Time Series (Daily)']) {
                        stockChartXValuesFunction.push(key);
                        stockChartYValuesFunction.push(data['Time Series (Daily)'][key]['4. close']);
                        if(firstkey===true)//(key===tablekey)
                        {
                            firstkey = false;
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
        if (this.state.showTable === true) {
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

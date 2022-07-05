import { Chart, registerables } from 'chart.js';
import React, { useEffect, useState } from 'react';
import './App.css';

Chart.register(...registerables);

const fetchApi = (/* url */) => {
  return window.Promise.resolve([
    {
      value: 1,
      title: 'rub',
    },
    {
      value: 60 - Math.floor(Math.random() * 10),
      title: 'usd'
    }
  ]);
}

class App2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      usd: 0,
      rubAmount: 0,
    }

    this.timeout = undefined;

    this.fetchApi = fetchApi;
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.rubAmount !== this.state.rubAmount) {
      console.log('[AMOUNT_CHANGE] Interface input change: %s', this.state.rubAmount);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  loadData = () => {
    setTimeout(() => {
      this.fetchApi()
        .then((data) => {
          console.log('Data is loaded at ' + new Date());
          const usd = data.find(c => c.title === 'usd');

          this.setState({
            usd: usd.value,
            loading: false,
          });

          this.timeout = window.setTimeout(this.loadData, 5 * 1000);
        })
    }, 1000);
  }

  calcUSD = () => {
    const { usd, rubAmount, loading } = this.state;

    if (loading) {
      return 0;
    }

    return (rubAmount / usd).toFixed(2);
  }

  onChangeHandler = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: Number(value),
    });
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;

    return (
      <div>
        <div>
          <input
            type="number"
            min="0"
            max="1000000"
            step=".01"
            name="rubAmount"
            defaultValue={this.state.rubAmount}
            onChange={this.onChangeHandler}
          />
        </div>
        <div>
          {this.calcUSD()} (1 usd = {this.state.usd} rub)
        </div>
      </div>
    );
  }
}

let chart;

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState();
  const [rubAmount, setRubAmount] = useState(0);
  const [usd, setUsd] = useState(0);
  let timeout;

  const loadData = () => {
    setTimeout(() => {
      fetchApi()
        .then(data => {
          console.log('Data is loaded at ' + new Date());
          const usd = data.find(c => c.title === 'usd');

          setUsd(usd.value);
          setLoading(false);
          setUpdated(new Date().getTime());
        })
    }, 1000);
  }

  useEffect(loadData, []); // componentDidMount

  useEffect(() => {
    if (!loading) {
      timeout = window.setTimeout(loadData, 5 * 1000);

      if (!chart) {

        const canvasEl = document.getElementById('canvasId').getContext('2d');

        chart = new Chart(canvasEl, {
          type: 'bar',
          data: {
              labels: ['User', 'User-200'],
              datasets: [{
                  data: [10, 10],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                  ],
                  borderWidth: 1
              }]
          },
        })

      }

    }

    return () => {
      window.clearTimeout(timeout); // componentWillUnmount
    }
  }, [updated]); // componentDidUpdate

  useEffect(() => {
    
    if (chart) {

      chart.data.datasets[0].data=[
        rubAmount,
        rubAmount - 200,
      ];

      chart.update();
    }

  }, [rubAmount]); // componentDidUpdate

  const calcUSD = () => loading ? 0 : (rubAmount / usd).toFixed(2);

  const onChangeHandler = (event) => {
    setRubAmount(Number(event.target.value));
  }

  return loading ? (<div>Loading...</div>) : (
    <div>
      <div>
        <input
          type="number"
          min="0"
          max="1000000"
          step=".01"
          name="rubAmount"
          defaultValue={rubAmount}
          onChange={onChangeHandler}
        />
      </div>
      <div>
        {calcUSD()} (1 usd = {usd} rub)
      </div>
      <canvas id="canvasId" width="400" height="400" />
    </div>
  )
}

const MainApp = () => {
  const [visible, setVisible] = React.useState(true);

  return (
    <div>
      {visible ? <App /> : '0000'}

      <div>
        <button
          onClick={
            () => {
              setVisible(!visible);
            }
          }
        >{visible ? 'Hide' : 'Show'}</button>
      </div>
    </div>
  )
}

export default MainApp;

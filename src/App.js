import React, { useEffect, useState } from 'react';
import './App.css';

const fetchApi = (/* url */) => {
  return window.Promise.resolve([
    {
      value: 1,
      title: 'rub',
    },
    {
      value: 72 - Math.floor(Math.random() * 10),
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

    this.interval = undefined;

    this.fetchApi = fetchApi;
  }

  componentDidMount() {
    this.loadData();

    this.interval = setInterval(this.loadData, 5 * 1000);
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.rubAmount !== this.state.rubAmount) {
      // Something is happening here
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadData = () => {
    setTimeout(() => {
      this.fetchApi()
        .then(data => {
          console.log('Data is loaded at ' + new Date());
          const usd = data.find(c => c.title === 'usd');

          this.setState({
            usd: usd.value,
            loading: false,
          });
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

const App = () => {
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState();
  const [rubAmount, setRubAmount] = useState(0);
  const [usd, setUsd] = useState(0);
  let timeout;

  useEffect(() => {
    loadData();
  }, []); // componentDidMount

  useEffect(() => {
    if (!loading)
      timeout = setTimeout(loadData, 5 * 1000);

    return () => {
      clearTimeout(timeout); // componentWillUnmount
    }
  }, [updated]);

  useEffect(() => {
    console.log(rubAmount);
  }, [rubAmount]); // componentDidUpdate

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

  const calcUSD = () => {
    if (loading) {
      return 0;
    }

    return (rubAmount / usd).toFixed(2);
  }

  const onChangeHandler = (event) => {
    const { value } = event.target;

    setRubAmount(Number(value));
  }


  if (loading) return <div>Loading...</div>

  return (
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

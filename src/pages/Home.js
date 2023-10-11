import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';

export default function Home() {

  const token = sessionStorage.getItem("spbysptoken")
  const baseHeaders = {
    headers: {
      'token': token
    }
  }
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState([]);
  const [purchase, setPurchase] = useState(0);
  const [sale, setSale] = useState(0);
  const [rgain, setRgain] = useState(0);
  const [cvalue, setCvalue] = useState(0);
  const [ugain, setUgain] = useState(0);
  const [crate, setCrate] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [invest, setInvest] = useState({
    date: null,
    qty: null,
    rate: null
  });
  const [newrec, setNewrec] = useState({
    date: null,
    qty: null,
    rate: null
  });
  const [saleList, setSaleList] = useState([]);

  useEffect(() => {
    if (!token) {
      return
    };
    axios.get("http://localhost:5000/api/home/portfolio", baseHeaders)
      .then(res => {
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setPortfolio(res.data.data);
          let i;
          let purchasex = 0, salex = 0, rgainx = 0, cvaluex = 0, ugainx = 0, cratex = 0;
          for (i = 0; i < res.data.data.length; i++) {
            purchasex += res.data.data[i].buyamount;
            salex += res.data.data[i].saleamount;
            rgainx += res.data.data[i].realisedprofit;
            cvaluex += res.data.data[i].currentvalue;
            ugainx += (res.data.data[i].currentrate - res.data.data[i].buyavgrate) * res.data.data[i].qtyinhand;
            cratex += res.data.data[i].currentrate;
          }
          setPurchase(purchasex);
          setSale(salex);
          setRgain(rgainx);
          setCvalue(cvaluex);
          setUgain(ugainx);
          setCrate(cratex);
        };
      })
      .catch(err => {
        console.log(err);
        if (err.message === "Request aborted") {
          ;
        } else {
          toast.error("Server Error");
        };
      });
    axios.get("http://localhost:5000/api/home/forselect")
      .then(response => {
        if (!response.data.success) {
          toast.error(response.data.error);
        } else {
          setOptions(response.data.data);
        }
      })
      .catch(err => {
        toast.error("Error gettings Companies from server");
      });

  }, [newrec]);

  const convert2D = (num) => {
    if (num === -0) {
      const x = 0;
      return x.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const handleNewInvest = () => {
    document.getElementById("id01").style.display = "block"
    document.getElementById("date").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("rate").value = "";
    setInvest({
      date: "",
      qty: "",
      rate: ""
    });
    setSelected({ value: 0, label: "" });
  };

  const handleCloseInvestment = () => {
    document.getElementById("id01").style.display = "none"
  };

  const handleCloseRowModal = () => {
    document.getElementById("id02").style.display = "none"
  };

  const handleSaveInvest = () => {
    if (!validInvest()) {
      return;
    }
    axios.post("http://localhost:5000/api/home/buy", {
      shareid: selected.value,
      buydate: invest.date,
      buyqty: invest.qty,
      buyrate: invest.rate
    }, baseHeaders)
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          handleCloseInvestment();
          setNewrec({
            date: invest.date,
            qty: invest.qty,
            rate: invest.rate
          })
        } else {
          toast.error(res.data.error);
        };
      })
      .catch(err => {
        toast.error(err);
      })
  };

  const validInvest = () => {
    const today = moment();
    if (selected.label === null || selected.label === "") {
      toast.error("Please select a company");
      return false;
    }
    // alert(invest.date)
    if (invest.date === null || invest.date === "") {
      toast.error("Please enter a date of Purchase");
      return false;
    };
    if (invest.date > today.format("YYYY-MM-DD")) {
      toast.error("Purchase date should be of after today")
      return false;
    };
    if (invest.qty === '' || invest.qty === null) {
      toast.error("Please enter Purchase Qty");
      return false;
    };
    if (!parseInt(invest.qty)) {
      toast.error("Qty entered is not a valid number");
      return false;
    };
    if (invest.rate === '' || invest.rate === null) {
      // alert(invest.rate)
      toast.error("Please enter Purchase Rate");
      return false;
    };
    if (!parseFloat(invest.rate)) {
      toast.error("Rate entered is not a valid number");
      return false;
    };
    return true;
  };

  const handleCompany = (selectedOption) => {
    setSelected(selectedOption);
  };

  const handleRow = (symbol, company, qty) => {
    if(qty === 0) return;
    document.getElementById("id02").style.display = "block";
    axios.post("http://localhost:5000/api/home/listforsale", { symbol: symbol }, baseHeaders)
      .then(res => {
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setSaleList(res.data.data);
          console.log(res.data.data);
        };
      })
      .catch(err => {
        console.log(err);
        if (err.message === "Request aborted") {
          ;
        } else {
          toast.error("Server Error");
        };
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/home/deletebuy/${id}`, baseHeaders)
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          setNewrec({
            date:null,
            qty:null,
            rate:null
          });
          document.getElementById("id02").style.display = "none";
        } else {
          toast.error(res.data.error);
        };
      })
      .catch(err =>{});
  };

  const handleSell = (id, maxQty) => {
    document.getElementById("id02").style.display = "none";
    alert(`Record no ${id} sold ${maxQty} nos`);
  };

  return (
    <div>
      {token ? (
        <>
          <div>
            <div className="container fs-2">
              <div className="row justify-content-between ">
                <div className="col-4 text-center text-warning fw-bold">Investment Portfolio</div>
                <div className="col-2 text-end me-4"><button className="btn btn-sm btn-warning" onClick={handleNewInvest}>+Invest</button></div>
              </div>
              <div className="container w-100 vh-90 overflow-visible">
                <div className="row justify-content-between mb-2 px-3" style={{ fontSize: '1.2rem' }}>
                  <div className="col-3 text-center badge rounded-pill text-bg-warning py-2">Purchased: {convert2D(purchase)}</div>
                  <div className="col-3 text-center badge rounded-pill text-bg-warning py-2">Sold: {convert2D(sale)}</div>
                  <div className={
                    rgain > 0 ? "col-3 text-center badge rounded-pill text-bg-success py-2"
                      : rgain < 0 ? "col-3 text-center badge rounded-pill text-bg-danger py-2"
                        : "col-3 text-center badge rounded-pill text-bg-warning"
                  }>Realised Gain: {convert2D(rgain)}</div>
                </div>
                <table style={{ fontSize: '0.8rem' }} className="table table-dark table-hover py-2">
                  <thead>
                    <tr>
                      <th scope="col" >Symbol</th>
                      <th scope="col">Name</th>
                      <th className="text-end" scope="col">Qty</th>
                      <th className="text-end" scope="col">Rate</th>
                      <th className="text-end" scope="col">Cost</th>
                      <th className="text-end" scope="col">Current rate</th>
                      <th className="text-end" scope="col">Current Value</th>
                      <th className="text-end" scope="col">Unrelaised Gain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((record) => (
                      <tr onClick={() => { handleRow(record.symbol, record.company, record.qtyinhand) }}>
                        <th scope="row">{record.symbol}</th>
                        <td>{record.company}</td>
                        <td className="text-end">{record.qtyinhand}</td>
                        <td className="text-end">{convert2D(record.buyavgrate)}</td>
                        <td className="text-end">{record.qtyinhand ? convert2D(record.buyamount) : "0.00"}</td>
                        <td className="text-end">{record.currentrate === 0 ? "N/A" : convert2D(record.currentrate)}</td>
                        <td className="text-end">{record.currentrate === 0 ? "N/A" : convert2D(record.currentvalue)}</td>
                        <td className="text-end">{record.currentrate === 0 ? "N/A" : convert2D((record.currentrate - record.buyavgrate) * record.qtyinhand)}</td>
                      </tr>
                    ))}
                    <tr>
                      <th className="text-center" colSpan="4" scope="col" >Totals</th>
                      <th className="text-end" scope="col">{convert2D(purchase)}</th>
                      <th className="text-end" scope="col">&nbsp;</th>
                      <th className="text-end" scope="col">{crate === 0 ? "N/A" : convert2D(cvalue)}</th>
                      <th className="text-end" scope="col">{crate === 0 ? "N/A" : convert2D(ugain)}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div id="id01" className="w3-modal">
            <div className="w3-modal-content bg-dark" style={{ width: '35%' }}>
              <div className="w3-container">
                <span onClick={handleCloseInvestment} className="w3-button w3-display-topright text-bg-dark">&times;</span>
                <div>New Investment</div>
                <div className="modal-body" style={{ fontSize: '0.8rem' }}>
                  <div>
                    <label className="text-bg-dark mb-1"><b>Select Share</b></label>
                    <Select
                      options={options}
                      onChange={handleCompany}
                    />
                  </div>
                  <div className="mt-2 row">
                    <div className="mb-3 col-4">
                      <label for="exampleFormControlInput1" class="form-label text-bg-dark">Date</label>
                      <input type="date" class="form-control" id="date" onChange={(e) => setInvest({ ...invest, date: e.target.value })} />
                    </div>
                    <div className="mb-3 col-4">
                      <label for="exampleFormControlInput1" class="form-label text-bg-dark">Qty</label>
                      <input type="number" class="form-control" id="qty" placeholder="Qty" onChange={(e) => setInvest({ ...invest, qty: e.target.value })} />
                    </div>
                    <div className="mb-3 col-4">
                      <label for="exampleFormControlInput1" class="form-label text-bg-dark">Rate</label>
                      <input type="number" class="form-control" id="rate" placeholder="Rate" onChange={(e) => setInvest({ ...invest, rate: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer mb-3">
                  <button type="button" className="btn btn-dark me-3" onClick={handleCloseInvestment}>Close</button>
                  <button type="button" className="btn btn-warning" onClick={handleSaveInvest}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div id="id02" className="w3-modal">
            <div className="w3-modal-content bg-dark" style={{ width: '35%' }}>
              <div className="w3-container">
                <span onClick={handleCloseRowModal} className="w3-button w3-display-topright text-bg-dark">&times;</span>
                {/* <div className="mt-3 text-warning fs-5 text-center">Purchase history for <br/>{saleList[0].company} ({saleList[0].symbol})</div> */}
                <div className="modal-body" style={{ fontSize: '0.8rem' }}>
                  <table style={{ fontSize: '0.8rem' }} className="table table-dark table-hover py-2">
                    <thead>
                      <tr>
                        <th className="text-end" scope="col">Qty</th>
                        <th className="text-end" scope="col">Rate</th>
                        <th className="text-end" scope="col">Cost</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleList.map((record) => (
                        <tr>
                          <td className="text-end">{record.qtyinhand}</td>
                          <td className="text-end">{convert2D(record.buyrate)}</td>
                          <td className="text-end">{convert2D(record.buyrate*record.qtyinhand)}</td>
                          <td><button className="btn btn-sm btn-outline-primary me-1" style={{fontSize:'0.6rem'}} onClick={()=>{handleSell(record.id, record.qtyinhand)}}>&nbsp;&nbsp;Sell&nbsp;&nbsp;</button><button className="btn btn-sm btn-outline-danger" style={{fontSize:'0.6rem'}} onClick={()=>{handleDelete(record.id)}}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer mb-3">
                  <button type="button" className="btn btn-dark me-3" onClick={handleCloseRowModal}>Close</button>
                  {/* <button type="button" className="btn btn-warning" onClick={handleSaveInvest}>Save changes</button> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', marginTop: '5%' }}>Please login to use the Portfolio Tracker</h1>
        </>
      )
      }
    </div >
  );
}

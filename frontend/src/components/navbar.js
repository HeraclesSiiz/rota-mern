import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllDatas } from "../store/Actions/BasicAction";
import axios from "../config/server.config";
import ReactLoading from "react-loading";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBBadge,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtnGroup,
  MDBBtn,
} from "mdb-react-ui-kit";
//import react pro sidebar components
import {
  ProSidebar,
} from "react-pro-sidebar";

//import icons from react icons
import {
  FaBell,
  FaEyeSlash,
  FaCheck,
  FaUndo,
} from "react-icons/fa";

import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  positionClass: "toast-top-full-width",
  hideDuration: 3000,
  timeOut: 3000,
};

export const NavLink = styled(Link)`
  color: #ffffff;
  font-family: Roboto, Helvetica Neue, sans-serif;
  font-size: 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 5px 12px;
  height: 100%;
  cursor: pointer;
  &.active {
    color: white;
    background-color: #32a852;
  }
`;

export const NavItem = styled(MDBNavbarItem)`
  padding: 5px;
`;
export const NavBrand = styled(MDBNavbarBrand)`
  color: white;
  font: inherit;
  font-size: 20px;
`;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      menuCollapse: true,
    };
  }
  menuIconClick = () => {
    this.setState({
      menuCollapse: !this.state.menuCollapse,
    });
  };
  componentDidMount() {
    var _self = this;
    axios
      .get("basic/list")
      .then((response) => {
        _self.setState({
          isLoading: false,
        });
        this.props.initialData(response.data);
      })
      .catch(function (error) {});
  }
  approve = (data) => {
    axios
      .post(data.request,{...data,status:2})
      .then(function (response) {
        let res = response.data;
        if(res.state == "error"){
          toastr.clear();
          setTimeout(() => toastr.info(data.title + " error!"), 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  reject = (data) => {
    axios
      .post(data.request,{...data,status:3})
      .then(function (response) {
        let res = response.data;
        if(res.state == "error"){
          toastr.clear();
          setTimeout(() => toastr.info(data.title + " error!"), 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  close = (request) => {
    axios
     .post('basic/request/close',{
        ...request
     }).then(function(response){
      let res = response.data;
      if(res.state == "error"){
        toastr.clear();
        setTimeout(() => toastr.info("request close error!"), 3000);
      }
     });
  }
  render() {
    const { isLoading } = this.state;
    const {user,requests,requestTitles,requestStatus} = this.props.basic;
    let cnt = 0;
    const Notifications = requests
      .filter(request => 
        (user.hasOwnProperty("role") && user.role == 1 && request.status == 1) || user.role == 0 || request.status == 1
      ).map((request,index) => {
        cnt++;
        return(
          <Toast 
            key = {index}
          >
            <Toast.Header>
              {request.status === 1 ? <FaEyeSlash color="grey"/> : request.status === 2 ? <FaCheck color="green"/> : <FaUndo color="red"/>}
              <strong className="me-auto">{requestStatus[request.status]}</strong>
            </Toast.Header>
            <Toast.Body>
              <h6>
                {requestTitles[request.request] + requestStatus[request.status]}
              </h6>
              <MDBBtnGroup size="sm">
                {user.hasOwnProperty("role") && request.status === 1 &&
                  <MDBBtn outline color = "primary">Detail</MDBBtn>
                }
                {user.hasOwnProperty("role") && user.role === 1 && request.status === 1 &&
                <>
                  <MDBBtn outline color = "success" onClick = {() => this.approve(request)}>Approve</MDBBtn>
                  <MDBBtn outline color = "danger"onClick = {() => this.reject(request)}>Reject</MDBBtn>
                </>
                }
                {user.hasOwnProperty("role") && user.role === 0 && request.status !== 1 &&
                  <MDBBtn outline color = "success" onClick = {() => this.close(request)}>Close</MDBBtn>
                }
              </MDBBtnGroup>
            </Toast.Body>
          </Toast>
        );
      })

    return (
      <>
        <div id="sidebar_notification">
          <div className="closemenu" onClick={this.menuIconClick}>
            <MDBBtn>
              <FaBell />
              {cnt !== 0 &&
                <MDBBadge className='ms-2' color='danger'>
                  {cnt}
                </MDBBadge>
              }
            </MDBBtn>
          </div>
          <ProSidebar collapsed={this.state.menuCollapse}>
              <ToastContainer className="p-3 mt-5" closeButton={false}>
              {
                Notifications
              }
              </ToastContainer>
          </ProSidebar>
        </div>
        <MDBNavbar expand="lg" fixed="top" bgColor="success">
          <ReactLoading
            type={"bubbles"}
            style={{
              display: isLoading ? "block" : "none",
              position: "fixed",
              top: "50vh",
              left: "50vw",
              width: "100px",
            }}
          />
          <MDBContainer fluid>
            <NavBrand href="/" style={{ marginLeft: "25px" }}>
              <img
                style={{ width: "80px", height: "30px" }}
                src="logo-rated.png"
              />
            </NavBrand>
            <MDBNavbarToggler
              type="button"
              data-target="#navbarColor02"
              aria-controls="navbarColor02"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
            </MDBNavbarToggler>
            <MDBCollapse navbar>
              <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
                <NavItem>
                  <NavLink aria-current="page" to="basic">
                    Registration
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink aria-current="page" to="working">
                    Working Days
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink aria-current="page" to="leave">
                    Leave Days
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink aria-current="page" to="roaster">
                    Roaster
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink aria-current="page" to="dtr">
                    DTR
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink aria-current="page" to="fte">
                    FTE
                  </NavLink>
                </NavItem>
                {
                  (user.role && user.role !== 0) ?
                  <>
                    <NavItem>
                      <NavLink aria-current="page" to="payroll">
                        PayRoll
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink aria-current="page" to="revenue">
                        Revenue
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink aria-current="page" to="pnl">
                        PNL
                      </NavLink>
                    </NavItem>
                  </>
                  :
                  <></>
                }
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  initialData: (data) => dispatch(getAllDatas(data,dispatch)),
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,mapDispatchToProps)(Navbar)
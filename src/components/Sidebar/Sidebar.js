
/*eslint-disable*/
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';

var ps;

function Sidebar(props) {
    const sidebar = React.useRef();
    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName) => {
        return props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
    };
    React.useEffect(() => {
        if (navigator.platform.indexOf('Win') > -1) {
            ps = new PerfectScrollbar(sidebar.current, {
                suppressScrollX: true,
                suppressScrollY: false,
            });
        }
        return function cleanup() {
            if (navigator.platform.indexOf('Win') > -1) {
                ps.destroy();
            }
        };
    });

    return (
        <div className='sidebar' data-color={props.backgroundColor}>
            <div className='sidebar-wrapper' ref={sidebar}>
                <Nav>
                    {props.routes.map((prop, key) => {
                        if (prop.redirect) return null;
                        return (
                            <li className={activeRoute(prop.layout + prop.path)} key={key}>
                                <NavLink to={prop.layout + prop.path} className='nav-link' activeClassName='active'>
                                    <i className={'now-ui-icons ' + prop.icon} />
                                    <p>{prop.name}</p>
                                </NavLink>
                            </li>
                        );
                    })}
                </Nav>
            </div>
        </div>
    );
}

export default Sidebar;

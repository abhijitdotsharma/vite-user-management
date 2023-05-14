import { useState, useEffect, useCallback, useReducer } from 'react';
// import UserComp from './components/UserComp';
import Textfield from '@atlaskit/textfield';
import './Home.css';
import Button, { ButtonGroup } from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Example from './Example';
import { userFilterReducer } from './reducers/userFilterReducer';
import {
  getAgeSortedUsers,
  getBloodGroupFilteredUsers,
  getNameSortedUsers,
  getGenderFilteredUsers,
  getUniversityFilteredUsers,
} from './utilities';
import Shortlisted from './components/Shortlisted';

function Home({ showAllEmployees, searchUser }) {
  const [users, setUsers] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);

  const initialFilterState = {
    gender: '',
    bloodGroup: '',
    university: '',
    sortBy: '',
  };
  const [userFilterState, userFilterDispatch] = useReducer(
    userFilterReducer,
    initialFilterState
  );

  const shortlistEmployee = (currUser) => {
    setShortlisted((prev) => [...prev, { currUser }]);
  };

  const handlePrevPage = () => {
    if (skip > 0) {
      setSkip((prev) => prev - 15);
    }
  };

  const handleNextPage = () => {
    setSkip((prev) => prev + 15);
  };

  const fetchFunc = () => {
    // fetch(`https://dummyjson.com/users/search?q=${searchUser}`)
    // fetch(`https://dummyjson.com/users/filter?key=gender&value=${gender}`)
    fetch(
      `https://dummyjson.com/users/search?q=${searchUser}&limit=${limit}&skip=${skip}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setUsers(resJson.users);
      });
  };

  useEffect(() => {
    fetchFunc();
  }, [searchUser, skip]);

  const nameSortedUsers = getNameSortedUsers(
    users,
    userFilterState?.sortBy
  );

  const ageSortedUsers = getAgeSortedUsers(
    nameSortedUsers,
    userFilterState?.sortBy
  );

  const universityFilteredUsers = getUniversityFilteredUsers(
    ageSortedUsers,
    userFilterState.university
  );

  const bloodFilteredUsers = getBloodGroupFilteredUsers(
    universityFilteredUsers,
    userFilterState.bloodGroup
  );
  // bloodFilteredUsers is passed onto getGenderFilteredUsers
  // this lets us use more that one filter simultaneously
  const genderedUsers = getGenderFilteredUsers(
    bloodFilteredUsers,
    userFilterState.gender
  );

  return (
    <div className="home">
      {showAllEmployees ? (
        <>
          <div className="container">
            <div className="user-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Blood Group</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Age</th>
                  </tr>
                </thead>
                {genderedUsers?.map((user, i) => (
                  <tbody key={i}>
                    <tr>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.company.name}</td>
                      <td>{user.bloodGroup}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.age}</td>
                      <td>
                        <Example
                          shortlistEmployee={shortlistEmployee}
                          user={user}
                        />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
          <div
            className="footer"
            style={{
              position: 'fixed',
              bottom: '1rem',
              width: '100%',
              height: '20%',
            }}
          >
            <div>
              <Button
                appearance="danger"
                iconAfter={<CrossIcon label="" size="medium" />}
                onClick={() => userFilterDispatch({ type: 'CLEAR' })}
              >
                Clear Filters
              </Button>
              <Button appearance="primary" onClick={handlePrevPage}>
                Prev
              </Button>
              <Button appearance="primary" onClick={handleNextPage}>
                Next
              </Button>
            </div>

            <Button
              appearance="warning"
              onClick={() =>
                userFilterDispatch({
                  type: 'GENDER',
                  payload: 'male',
                })
              }
            >
              male
            </Button>

            <Button
              appearance="warning"
              onClick={() =>
                userFilterDispatch({
                  type: 'GENDER',
                  payload: 'female',
                })
              }
            >
              female
            </Button>

            <Textfield
              width={200}
              appearance="standard"
              label="Standard"
              placeholder="Blood Group"
              onChange={(e) =>
                userFilterDispatch({
                  type: 'BLOOD',
                  payload: e.target.value,
                })
              }
            />

            <Textfield
              width={200}
              appearance="standard"
              label="Standard"
              placeholder="University"
              onChange={(e) =>
                userFilterDispatch({
                  type: 'UNIVERSITY',
                  payload: e.target.value,
                })
              }
            />

            <Button
              appearance="primary"
              onClick={() =>
                userFilterDispatch({ type: 'SORT_BY_AGE' })
              }
            >
              Sort By Increasing Age
            </Button>

            <Button
              appearance="primary"
              onClick={() =>
                userFilterDispatch({
                  type: 'SORT_BY_NAME',
                  payload: 'FIRST_NAME',
                })
              }
            >
              Sort By First Name
            </Button>
            <Button
              appearance="primary"
              onClick={() =>
                userFilterDispatch({
                  type: 'SORT_BY_NAME',
                  payload: 'LAST_NAME',
                })
              }
            >
              Sort By First Name
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Shortlisted shortlisted={shortlisted} />
        </div>
      )}
    </div>
  );
}

export default Home;

import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

const AllStudentsPage = () => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/user/users`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log('Fetched user data:', response.data);
                setStudents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Hiba az adatok lekérésekor:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);

    if (loading) {
        return <p>Loading user data...</p>;
    }

    if (!students || students.length === 0) {
        return <p>No user data found.</p>;
    }

    return (
        <div>

        </div>
    )
}

export default AllStudentsPage
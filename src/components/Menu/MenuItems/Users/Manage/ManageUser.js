import "antd/dist/antd.min.css";
import React, { useState, useEffect } from "react";
import { Modal, Transfer, notification } from "antd";
import differenceBy from "lodash/differenceBy";
import { addUserToGroups, getGroups } from "../../../../../api/UserAPI";

const ManageUserGroups = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [userData, setUserData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        const res = await getGroups();
        if (res.status === 200) {
            const data = await res.data.map((d) => {
                return { key: d.name, ...d };
            });
            setUserData(data);
            setTargetKeys(
                differenceBy(data, props.user.groups, "name").map(
                    (data) => data.name
                )
            );
        }
    };

    const handleOk = async () => {
        const res = await addUserToGroups(
            props.user.username,
            userData
                .filter((group) => targetKeys.indexOf(group.name) < 0)
                .map((group) => group.name)
        );
        if (res.status === 200) {
            notification.success({
                message: "Operation done successfully",
                placement: "top",
                duration: 1.5,
            });
            props.reloadUsers();
            setIsModalVisible(false);
            props.setManageMenu();
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        props.setManageMenu();
    };
    const filterOption = (inputValue, option) =>
        option.name.indexOf(inputValue) > -1;

    const handleChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };

    return (
        <Modal
            title="Manage groups"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={true}
            style={{ display: "flex" }}
        >
            <Transfer
                titles={["Joined", "Available"]}
                dataSource={userData}
                showSearch
                filterOption={filterOption}
                targetKeys={targetKeys}
                onChange={handleChange}
                render={(item) => item.name}
                listStyle={{ height: 300 }}
            />
        </Modal>
    );
};

export default ManageUserGroups;

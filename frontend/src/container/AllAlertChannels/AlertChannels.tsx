/* eslint-disable react/display-name */
import { Button, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ResizeTable } from 'components/ResizeTable';
import ROUTES from 'constants/routes';
import useComponentPermission from 'hooks/useComponentPermission';
import history from 'lib/history';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath } from 'react-router-dom';
import { AppState } from 'store/reducers';
import { Channels, PayloadProps } from 'types/api/channels/getAll';
import AppReducer from 'types/reducer/app';

import Delete from './Delete';

function AlertChannels({ allChannels }: AlertChannelsProps): JSX.Element {
	const { t } = useTranslation(['channels']);
	const [notifications, Element] = notification.useNotification();
	const [channels, setChannels] = useState<Channels[]>(allChannels);
	const { role } = useSelector<AppState, AppReducer>((state) => state.app);
	const [action] = useComponentPermission(['new_alert_action'], role);

	const onClickEditHandler = useCallback((id: string) => {
		history.replace(
			generatePath(ROUTES.CHANNELS_EDIT, {
				id,
			}),
		);
	}, []);

	const columns: ColumnsType<Channels> = [
		{
			title: t('column_channel_name'),
			dataIndex: 'name',
			key: 'name',
			width: 100,
		},
		{
			title: t('column_channel_type'),
			dataIndex: 'type',
			key: 'type',
			width: 80,
		},
	];

	if (action) {
		columns.push({
			title: t('column_channel_action'),
			dataIndex: 'id',
			key: 'action',
			align: 'center',
			width: 80,
			render: (id: string): JSX.Element => (
				<>
					<Button onClick={(): void => onClickEditHandler(id)} type="link">
						{t('column_channel_edit')}
					</Button>
					<Delete id={id} setChannels={setChannels} notifications={notifications} />
				</>
			),
		});
	}

	return (
		<>
			{Element}
			<ResizeTable columns={columns} dataSource={channels} rowKey="id" />
		</>
	);
}

interface AlertChannelsProps {
	allChannels: PayloadProps;
}

export default AlertChannels;

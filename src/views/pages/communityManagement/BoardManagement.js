import React, { useEffect, useState } from 'react'
import UsageSetting from './Component/UsageSetting';
import WelfareBoard from './Component/WelfareBoard';
import BulletinBoard from './Component/BulletinBoard';
import ClubBoard from './Component/ClubBoard';

const BoardManagement = () => {

    const [currentTab, setCurrentTab] = useState('General settings');

    const setTab = (tab) => {
        setCurrentTab(tab);
    };

    return (
        <>
            <main>
                <div className='container p-3 mb-3'>
                    <div>
                        <div className='camp-tab-cont d-flex'>
                            <div
                                className='nav nav-tabs'
                                id='nav-tab'
                                role='tablist'
                            >
                                <button
                                    className={`primary-btn ${currentTab == 'General settings' && 'active'}`}
                                    id='edit-tab'
                                    data-bs-toggle='tab'
                                    data-bs-target='#edit'
                                    type='button'
                                    role='tab'
                                    aria-selected='true'
                                    onClick={() => setTab('General settings')}
                                >
                                    General settings
                                </button>
                                <button
                                    className={`primary-btn ${currentTab == 'Bulletin board' && 'active'}`}
                                    id='review-tab'
                                    data-bs-toggle='tab'
                                    data-bs-target='#review'
                                    type='button'
                                    role='tab'
                                    aria-selected='false'
                                    onClick={() => setTab('Bulletin board')}
                                >
                                    Bulletin board
                                </button>
                                <button
                                    className={`primary-btn ${currentTab == 'Club board' && 'active'}`}
                                    id='history-tab'
                                    data-bs-toggle='tab'
                                    data-bs-target='#history'
                                    type='button'
                                    role='tab'
                                    aria-selected='false'
                                    onClick={() => setTab('Club board')}
                                >
                                    Club board
                                </button>
                                <button
                                    className={`primary-btn ${currentTab == 'Welfare board' && 'active'}`}
                                    id='history-tab'
                                    data-bs-toggle='tab'
                                    data-bs-target='#history'
                                    type='button'
                                    role='tab'
                                    aria-selected='false'
                                    onClick={() => setTab('Welfare board')}
                                >
                                    Welfare board
                                </button>
                            </div>
                        </div>
                        {currentTab === 'General settings' && <UsageSetting />}
                        {currentTab === 'Bulletin board' &&  <BulletinBoard />}
                        {currentTab === 'Club board' && <ClubBoard />}
                        {currentTab === 'Welfare board' && <WelfareBoard />}
                    </div>

                </div>
            </main>
        </>
    )
}

export default BoardManagement

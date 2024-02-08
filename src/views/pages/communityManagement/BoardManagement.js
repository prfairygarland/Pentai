import React, { useEffect, useState } from 'react'
import UsageSetting from './Component/UsageSetting';
import WelfareBoard from './Component/WelfareBoard';
import BulletinBoard from './Component/BulletinBoard';
import ClubBoard from './Component/ClubBoard';
import { useTranslation } from 'react-i18next';


const BoardManagement = () => {

    const [currentTab, setCurrentTab] = useState('General settings');

    const setTab = (tab) => {
        setCurrentTab(tab);
    };

    const { i18n } = useTranslation();
    const translationObject = i18n.getDataByLanguage(i18n.language);  

    return (
        <>
            <main>
            <div className='pageTitle mb-3 pb-2'>
      <h2>Board Management</h2>
    </div>
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
                                    {translationObject?.translation?.communityBoardManagement?.generalSettings}
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
                                    {translationObject?.translation?.communityBoardManagement?.bulletinBoard}
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
                                    {translationObject?.translation?.communityBoardManagement?.clubBoard}
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
                                    {translationObject?.translation?.communityBoardManagement?.welfareBoard}
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

/**
* Installs a list of plugins and applications.
*
* @author Maik Skoddow
* @param {Array} arrToBeInstalled
*	List of plugin IDs or application scope to be installed
* @param {Boolean} dryRun
*	If `true` only output is given but no installations are performed
*/
function installPluginsAndApplications(arrToBeInstalled, dryRun) {

    if (!Array.isArray(arrToBeInstalled) || arrToBeInstalled.length === 0) {
        gs.error('Parameter "arrToBeInstalled" does not represent a valid array!');
    }

    var _dryRun           = typeof dryRun === 'boolean' ? dryRun : false;
    var _objToBeInstalled = {};
    var _grPlugins        = new GlideRecord('v_plugin');
    var _grRemoteApps     = new GlideRecord('sys_remote_app');
    var _grInstalledApps  = new GlideRecord('sys_store_app');

    Array.forEach(arrToBeInstalled, function(strID) {
        if (_grPlugins.get('id', strID)) {
            if (_grPlugins.getValue('active') == 'active') {
                gs.warn(
                    'Plugin "{0}" (ID: {1}) is already installed!', 
                    _grPlugins.name, strID
                );
            }
            else {
                _objToBeInstalled[strID] = {
                    "plugin_id" : strID,
                    "scope"     : _grPlugins.getValue('scope'),
                    "app_name"  : _grPlugins.getValue('name'),
                    "isPlugin"  : true
                }

                gs.info(
                    'Queue Plugin "{0}" (ID: {1}) for installation', 
                    _grPlugins.getValue('name'), strID
                );
            }
        }
        else if (_grInstalledApps.get('scope', strID)) {
            gs.warn(
                'Application "{0}" (ID: {1}) is already installed!', 
                _grInstalledApps.name, strID
            );
        }
        else if (_grRemoteApps.get('scope', strScope)) {
            _objToBeInstalled[_grRemoteApps.getUniqueValue()] = {
                "sys_id"    : _grRemoteApps.getUniqueValue(),
                "app_name"  : _grRemoteApps.getValue('name'),
                "isStoreApp": true,
                "appScope"  : strID,
                "versionObj": {
                    "version": _grRemoteApps.getValue('latest_version')
                }
            }                

            gs.info(
                'Queue Application "{0}" (ID: {1}) for installation', 
                _grRemoteApps.getValue('name'), strID
            );
        }
        else {
            gs.error('"{0}" is not a valid plugin or application ID!', strScope)
        }
    });
        
    gs.info(
        'Start installation of {0} plugins and applications... ',
        Object.keys(_objToBeInstalled).length
    );

    if (!_dryRun) {
        gs.info(
            new sn_appclient.AppPluginInstallation().validateAndBatchInstall(
                'PDI Installation', 
                _objToBeInstalled
            )
        );
    }
}

installPluginsAndApplications([		
	'com.snc.incident.mim', //Major Incident Management
	'com.snc.change_management.risk_assessment', //Change Risk Assesment
	'com.glide.messaging.awa', //Conversational Messaging
	'com.snc.incident.awa', //Advanced Work Assignment for Incidents
		
	'com.glide.cs.chatbot', //Virtual Agent
	'com.glideapp.cs.sm_topic_blocks', //Service Management Virtual Agent Topic Blocks
		
	'com.snc.itom.discovery.license', //ITOM Discovery License
	'sn_getwell', //CMDB and CSDM Data Foundations Dashboards

	'com.snc.financial_planning_pmo', //PPM
	'com.snc.project_management_v3', //Project Management 
	'com.snc.sdlc.agile.2.0', //Agile Development
	'com.snc.sdlc.agile.multi_task', //Unified Backlog
	'com.snc.test_management.2.0', //Test Management
	'com.snc.release_management_v2', //Release Management
	'sn_pw', //Project Workspace
	'sn_dpm', //Digital Portfolio Management
	'sn_service_builder', //Service Builder

	'com.sn_customerservice', //Customer Service Management
	'com.sn_communities', //Communities
	'com.sn_shn', //Special Handling Notes#
		
	'com.snc.work_management', //FSM Base
	'com.snc.service_management.geolocation', //Service Management Geolocation
	'sn_fsm_disp_wrkspc', //Planned Maintenance
	'sn_fsm_pm', //Planned Maintenance
	'com.sn_fsm_mobile', //Mobile App
	'com.snc.fsm_capacity_management', //Field Service Capacity and Reservations Management
	'com.snc.fsm_crew_scheduling', //Field Service Crew Operations
	'com.snc.time_recording_fsm', //Time Recording
	'com.snc.work_management.demo', //Demo Data

	'com.snc.integration.multifactor.authentication', //MFA
	'com.snc.integration.sso.multi.installer', //SSO
	'sn_access_analyzer', //Access Analyzer
	'com.snc.documentviewer', //Document Viewer
	'com.snc.linkgenerator', //Link Generator
	'com.snc.document_management', //Managed Documents
	'com.glide.quiz_designer', //Quiz Designer
	'sn_vsc', //Security Center
]);

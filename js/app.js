// Default user interface controls
var USER_CONTROLS = {
    "START_MONTH": "1701",
    "DURATION": "1",
    "TIME_WEIGHT": "0",
    "ALGORITHM": "kmeans",
    "VIEW": "overview", // overview, hierarchical clusters or non-hierarchical clusters
}

// generate new filename to read
function generate_req_filename(){
    var req_filename = ''
    if (USER_CONTROLS.VIEW == "overview"){
        req_filename += 'data/profiles/' + USER_CONTROLS.VIEW + '_' + USER_CONTROLS.START_MONTH + '_' + USER_CONTROLS.DURATION + '.json';
    }
    else{
        req_filename += 'data/profiles/' + USER_CONTROLS.VIEW + '_' + USER_CONTROLS.START_MONTH + '_' + USER_CONTROLS.DURATION  + '_' + USER_CONTROLS.TIME_WEIGHT + '_' + USER_CONTROLS.ALGORITHM + '.json';
    }
    return req_filename;
}


// Listen to user input
$(document).ready(function() {

    // View request
    $("#req-form").on("submit", function(e) {
        e.preventDefault();

        // Set view
        var $view = $("#view-selection")[0];
        USER_CONTROLS.VIEW = $view.options[$view.selectedIndex].value;
        // Set start_month
        var $month = $("#month-selection")[0];
        USER_CONTROLS.START_MONTH = $month.options[$month.selectedIndex].value;
        // Set duration
        var $duration = $("#duration-selection")[0];
        USER_CONTROLS.DURATION = $duration.options[$duration.selectedIndex].value;
        // Set time weight
        var $time_weight = $("#time-weight-selection")[0];
        USER_CONTROLS.TIME_WEIGHT = $time_weight.options[$time_weight.selectedIndex].value;
        // Set algorithm
        var $algorithm = $("#algorithm-selection")[0];
        USER_CONTROLS.ALGORITHM = $algorithm.options[$algorithm.selectedIndex].value;

        var req_filename = generate_req_filename();

        $.getJSON(req_filename, function(response) {
            clusters = Object.keys(response).map(function(key) {
                    return response[key];
            });

            temporal_data = clusters.map(function(d) {
                return d.temporal_patterns;
            });
            geographical_data = clusters.map(function(d) {
                return d.geographical_patterns;
            });
            usertype_data = clusters.map(function(d) {
                return d.usertype;
            });
            tariff_data = clusters.map(function(d) {
                return d.tariff;
            });
            servicebrand_data = clusters.map(function(d) {
                return d.servicebrand;
            });

            // get cluster info
            clust_info_data = clusters.map(function(d) {
                return d.clust_info;
            });
            viz_data = clusters.map(function(d) {
                return d.viz;
            });
            // get all demographics info
            race_data = clusters.map(function(d) {
                return d.race;
            });
            edu_data = clusters.map(function(d) {
                return d.edu;
            });
            income_data = clusters.map(function(d) {
                return d.income;
            });

            // report
            report_data = clusters.map(function(d){return d.report});

            if (USER_CONTROLS.VIEW === 'overview') {
                USER_CONTROLS.VIEW_BY_CLUSTER = false;
            } else {
                USER_CONTROLS.VIEW_BY_CLUSTER = true;
            }

            $("#pca-chart").empty();
            clusterpcaVis = new ClusterPCAVis("pca-chart", viz_data, colors3, USER_CONTROLS.VIEW_BY_CLUSTER);
            $("#simple-stat-chart").empty();
            clusterstatVis = new ClusterSimpleStatVis("simple-stat-chart", "simple-stat-data-selection", clust_info_data, colors4, USER_CONTROLS.VIEW_BY_CLUSTER);
            $("#description-chart").empty();
            clusterReport = new ClusterReport("description-chart", "description-data-selection", report_data, USER_CONTROLS.VIEW_BY_CLUSTER);
            // update temporal pattern chart
            $("#temporal-legend").empty();
            timeLegend = new TemporalLegend("temporal-legend", temporal_data, colors)
            $("#temporal-chart").empty();
            timePatternVisTitleList = [];
            temporal_data.map(function(d, i) {
                timePatternVisTitleList.push("Cluster " + i);
            })
            timePatternVis = new TemporalPatternChart("temporal-chart", temporal_data, timePatternVisTitleList, temporal_data.length, colors)

            // update geographical pattern chart
            geoPatternVis.bostonMap.remove();
            geoPatternVis = new BostonMap("geographical-chart", geographical_data, 0, colors, USER_CONTROLS.VIEW_BY_CLUSTER);

            // update purchase pattern
            $('#purchase-chart').empty();
            // purchaseVis = new GroupDonutChart("purchase-chart", "purchase-data-selection", [usertype_data, tariff_data], ["User Type", "Tariff Type"], 2, 0, colors, USER_CONTROLS.VIEW);
            purchaseVis = new GroupDistributionChart("purchase-chart", "purchase_chart-selector", "purchase_view-selector", [usertype_data, tariff_data, servicebrand_data], ["User Type", "Tariff Type", "Servicebrand"], 3, 0, colors2, USER_CONTROLS.VIEW_BY_CLUSTER);

            // update basic demographics Charts
            $('#basic_demographics-chart').empty();
            basicDemographicsVis = new GroupDistributionChart("basic_demographics-chart", "basic_demographics_chart-selector",
                "basic_demographics_view-selector", [race_data, edu_data, income_data], ["Race", "Education", "Income"], 3, 0, colors2, USER_CONTROLS.VIEW_BY_CLUSTER);

        });
    })
});

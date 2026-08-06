import Village from "../models/VillageModel.js";
import City from "../models/CityModel.js";
import Town from "../models/TownModel.js";
import Division from "../models/DivisionModel.js";
import District from "../models/DistrictModel.js";
import Taluka from "../models/TalukaModel.js";
import Hospital from "../models/HospitalModel.js";
import School from "../models/SchoolModel.js";
import College from "../models/CollegeModel.js";

// Get population trends over time
export const getPopulationTrends = async (req, res) => {
  try {
    // Calculate total population from villages, cities, and towns
    const [villages, cities, towns] = await Promise.all([
      Village.find({}).select("population").lean(),
      City.find({}).select("population").lean(),
      Town.find({}).select("population").lean(),
    ]);

    // Calculate total population
    const totalPopulation = [...villages, ...cities, ...towns].reduce(
      (sum, entity) => sum + (Number(entity.population) || 0),
      0,
    );

    // Create trend data based on current population (you can enhance this with historical data if available)
    const trends = [
      {
        year: "Current",
        population: (totalPopulation / 1000000).toFixed(2), // Convert to millions
      },
    ];

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get population by division
export const getDivisionPopulation = async (req, res) => {
  try {
    const divisions = await Division.find({});

    const divisionPopulation = await Promise.all(
      divisions.map(async (division) => {
        // Aggregate population from villages, cities, and towns for this division
        const [villagePop, cityPop, townPop] = await Promise.all([
          Village.aggregate([
            { $match: { division: division.name } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$population", 0] } },
              },
            },
          ]),
          City.aggregate([
            { $match: { division: division.name } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$population", 0] } },
              },
            },
          ]),
          Town.aggregate([
            { $match: { division: division.name } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$population", 0] } },
              },
            },
          ]),
        ]);

        const totalPopulation =
          (villagePop[0]?.total || 0) +
          (cityPop[0]?.total || 0) +
          (townPop[0]?.total || 0);

        return {
          division: division.name,
          population: (totalPopulation / 1000000).toFixed(2), // Convert to millions
        };
      }),
    );

    // Sort by population descending
    divisionPopulation.sort((a, b) => b.population - a.population);

    res.status(200).json({
      success: true,
      data: divisionPopulation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get institution distribution
export const getInstitutionDistribution = async (req, res) => {
  try {
    const [hospitals, schools, colleges] = await Promise.all([
      Hospital.countDocuments(),
      School.countDocuments(),
      College.countDocuments(),
    ]);

    const distribution = [
      { name: "Hospitals", count: hospitals },
      { name: "Schools", count: schools },
      { name: "Colleges", count: colleges },
    ];

    res.status(200).json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get comprehensive analytics metrics
export const getAnalyticsMetrics = async (req, res) => {
  try {
    // Get counts
    const [districts, talukas, divisions] = await Promise.all([
      District.countDocuments(),
      Taluka.countDocuments(),
      Division.countDocuments(),
    ]);

    // Calculate total population from all entities
    const [villages, cities, towns] = await Promise.all([
      Village.find({}).select("population"),
      City.find({}).select("population"),
      Town.find({}).select("population"),
    ]);

    const totalPopulation = [...villages, ...cities, ...towns].reduce(
      (sum, entity) => sum + (Number(entity.population) || 0),
      0,
    );

    // Get institution counts
    const [hospitals, schools, colleges] = await Promise.all([
      Hospital.countDocuments(),
      School.countDocuments(),
      College.countDocuments(),
    ]);

    const institutionsCount = hospitals + schools + colleges;

    res.status(200).json({
      success: true,
      data: {
        districtsCount: districts,
        talukasCount: talukas,
        totalPopulation: (totalPopulation / 1000000).toFixed(2), // Convert to millions
        institutionsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all analytics data in one call
export const getAllAnalytics = async (req, res) => {
  try {
    const [
      metrics,
      populationTrends,
      divisionPopulation,
      institutionDistribution,
    ] = await Promise.all([
      getAnalyticsMetricsData(),
      getPopulationTrendsData(),
      getDivisionPopulationData(),
      getInstitutionDistributionData(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        metrics,
        populationTrends,
        divisionPopulation,
        institutionDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper functions to avoid code duplication
async function getAnalyticsMetricsData() {
  const [districts, talukas, divisions] = await Promise.all([
    District.countDocuments(),
    Taluka.countDocuments(),
    Division.countDocuments(),
  ]);

  const [villages, cities, towns] = await Promise.all([
    Village.find({}).select("population"),
    City.find({}).select("population"),
    Town.find({}).select("population"),
  ]);

  const totalPopulation = [...villages, ...cities, ...towns].reduce(
    (sum, entity) => sum + (Number(entity.population) || 0),
    0,
  );

  const [hospitals, schools, colleges] = await Promise.all([
    Hospital.countDocuments(),
    School.countDocuments(),
    College.countDocuments(),
  ]);

  return {
    districtsCount: districts,
    talukasCount: talukas,
    totalPopulation: (totalPopulation / 1000000).toFixed(2),
    institutionsCount: hospitals + schools + colleges,
  };
}

async function getPopulationTrendsData() {
  // Calculate total population from villages, cities, and towns
  const [villages, cities, towns] = await Promise.all([
    Village.find({}).select("population").lean(),
    City.find({}).select("population").lean(),
    Town.find({}).select("population").lean(),
  ]);

  // Calculate total population
  const totalPopulation = [...villages, ...cities, ...towns].reduce(
    (sum, entity) => sum + (Number(entity.population) || 0),
    0,
  );

  // Create trend data based on current population
  return [
    {
      year: "Current",
      population: (totalPopulation / 1000000).toFixed(2),
    },
  ];
}

async function getDivisionPopulationData() {
  const divisions = await Division.find({});

  const divisionPopulation = await Promise.all(
    divisions.map(async (division) => {
      const [villagePop, cityPop, townPop] = await Promise.all([
        Village.aggregate([
          { $match: { division: division.name } },
          {
            $group: {
              _id: null,
              total: { $sum: { $ifNull: ["$population", 0] } },
            },
          },
        ]),
        City.aggregate([
          { $match: { division: division.name } },
          {
            $group: {
              _id: null,
              total: { $sum: { $ifNull: ["$population", 0] } },
            },
          },
        ]),
        Town.aggregate([
          { $match: { division: division.name } },
          {
            $group: {
              _id: null,
              total: { $sum: { $ifNull: ["$population", 0] } },
            },
          },
        ]),
      ]);

      const totalPopulation =
        (villagePop[0]?.total || 0) +
        (cityPop[0]?.total || 0) +
        (townPop[0]?.total || 0);

      return {
        division: division.name,
        population: (totalPopulation / 1000000).toFixed(2),
      };
    }),
  );

  divisionPopulation.sort((a, b) => b.population - a.population);
  return divisionPopulation;
}

async function getInstitutionDistributionData() {
  const [hospitals, schools, colleges] = await Promise.all([
    Hospital.countDocuments(),
    School.countDocuments(),
    College.countDocuments(),
  ]);

  return [
    { name: "Hospitals", count: hospitals },
    { name: "Schools", count: schools },
    { name: "Colleges", count: colleges },
  ];
}

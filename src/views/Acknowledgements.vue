<template>
  <div class="text-base md:text-xl p-4 m-0 md:px-16 md:my-8 md:mx-24 space-y-6">
    <p>
      In the spirit of over 155 years of service through science, we at the
      Manila Observatory are responding to the
      <span class="font-bold">climate emergency</span> through contributions to
      climate change mitigation and adaptation and disaster risk reduction.
    </p>
    <p>
      <span class="font-bold">On mitigation</span>, we are eager to share our
      science to advance the use of indigenous renewable power (i.e. mainly
      solar and wind) which remains largely untapped in our country. Beyond
      emissions reduction, utilizing indigenous renewable energy is critical to
      our country’s shift towards a green and blue economy.
    </p>
    <p>
      <span class="font-bold">On adaptation</span>, our forecasts for climate
      and climate-related risk over the long term (i.e. 2030s to 2090s) can be
      integrated into the sustainability, disaster risk reduction and resilience
      efforts of local communities and other vulnerable sectors in the country.
      Forecasts are vital inputs to decisions and actions on social protection
      and ecosystem management for food, water and energy security.
    </p>
    <p>
      <span class="font-bold">On risk reduction</span>, climate risk analysis is
      essential to investments in resilience against the cascading impacts of
      climate change. It is especially important for micro, small and medium
      enterprises that comprise over 99% of the economy. Large corporations can
      likewise embed climate risk into their core value cycles and strategic
      social responsibility programs to achieve their environment, social and
      governance goals.
    </p>
    <p>
      <span class="font-bold">We can not do all this alone</span> and we are
      truly grateful to our private sector partners who have been most generous
      in their support of this urgent mission to rewire our economy and protect
      our communities. May God return their magnanimity many times over.
    </p>
    <div>
      <div class="text-2xl font-bold">Platinum Partners:</div>
      <ul class="px-12 py-4">
        <li v-for="p in platinumPartners" :key="p" class="list-disc">
          {{ p }}
        </li>
      </ul>
      <div class="text-2xl font-bold">Gold Partners:</div>
      <ul class="px-12 py-4">
        <li v-for="p in goldPartners" :key="p" class="list-disc">
          {{ p }}
        </li>
      </ul>
    </div>
    <p
      class="
        italic
        font-semibold
        mx-4
        md:mx-8
        p-4
        md:p-6
        border
        text-gray-100
        border-gray-500
      "
    >
      “We are not without hope. We have this decade to set things right. And we
      know we are not alone in heeding the call for all hands to be on deck, to
      batten down the hatches, so to speak, for the big storm that is about to
      define who we are for generations to come.”
    </p>
  </div>
</template>

<script>
export default {
  setup() {
    const platinumPartners = [
      "SM Group",
      "Ayala Group",
      "RVO Group",
      "RSO Group",
      "MVP Group",
    ];

    const goldPartners = ["La Filipina Uy Gongco", "Shell Philippines"];

    return {
      platinumPartners,
      goldPartners,
    };
  },
};
</script>
